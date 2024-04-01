---
title: Running Zephyr on ESP32
date: 2024-04-01
---

Two weeks ago I started toying around with a development version of [SumUp Solo](https://www.sumup.com/en-us/solo-card-reader/) card reader and learning more about embed and harward in general. Recently, we have launched a new reader, [Solo Lite](https://www.sumup.com/en-ie/solo-lite-card-reader/) which runs on [Zephyr](https://www.zephyrproject.org/) and seemed like an easier entrypoint. I don't have a development Solo Lite at hand but I found a couple unused [ESP32 microcontrollers](https://www.espressif.com/en/products/socs/esp32) at home so the task for the weekend was simple: get zephyr up and running on and esp32.

First, I followed the official [Getting started](https://docs.zephyrproject.org/latest/develop/getting_started/index.html) guide. I only diverged in the dependencies installation step, using [Nix](https://nixos.org/) instead of [Homebrew](https://brew.sh/). In my [home-manager](https://nix-community.github.io/home-manager/) config I added the necessary packages:

```nix
{ inputs
, outputs
, lib
, config
, pkgs
, unstable
, bleeding-edge
, ...
}:
let
  username = "matousdzivjak";
  homeDir = "/Users/${username}";
in
{
  ...
  home.packages = [
    pkgs.minicom # Modem control and terminal emulation program
    pkgs.wget
    pkgs.python3
    pkgs.ninja # Small build system with a focus on speed
    pkgs.gperf
    pkgs.ccache # Device Tree Compiler
    pkgs.dtc
  ];
}
```

(I switched to nix + home-manager [quite recently]({{< ref "/atoms/some_notes_on_nix" >}}). If you are interested in my whole config checkout [github.com/matoous/nix-home](https://github.com/matoous/nix-home))

Next, I update the binary blobs needed for ESP32:

```sh
west blobs fetch hal_espressif
```

With that, the development setup is done and what was left was actually getting something running on the esp and what's easier than a hello world. Zephyr comes with a hello world sample application, so we don't even have to write anything ourselves. The sample hello world app can be build using:

```sh
west build -p always -b esp32_devkitc_wroom zephyr/samples/hello_world
```

Resulting into an output ending with:

```
Generating files from /Users/matousdzivjak/code/github.com/matoous/esp32-zephyr/build/zephyr/zephyr.elf for board: esp32_devkitc_wroom
esptool.py v4.5
Creating esp32 image...
Merged 5 ELF sections
Successfully created esp32 image.
```

Last but not least, I flashed the ESP32 which was as simple as connecting it to the laptop with and USB-C cable and running:

```sh
west flash
```

The esp blinks a few times and the flashing is done in a couple of seconds. Theoretically, we have the hello world sample app up and running, but better confirm. For that, I connected to the esp using serial port to check the logs. First, `minicom` needed some tweeking as the last device I worked with had a different setup:

```sh
sudo minicom -s
```

This pops up the configuration menu:

```
 +-----[configuration]------+
| Filenames and paths      |
| File transfer protocols  |
| Serial port setup        |
| Modem and dialing        |
| Screen                   |
| Keyboard and Misc        |
| Save setup as dfl        |
| Save setup as..          |
| Exit                     |
| Exit from Minicom        |
+--------------------------+
```

Here one needs to configure the `Serial port setup`:

```
+-----------------------------------------------------------------------+
| A -    Serial Device      : /dev/modem                                |
| B - Lockfile Location     : /var/lock                                 |
| C -   Callin Program      :                                           |
| D -  Callout Program      :                                           |
| E -    Bps/Par/Bits       : 115200 8N1                                |
| F - Hardware Flow Control : No                                        |
| G - Software Flow Control : No                                        |
| H -     RS485 Enable      : No                                        |
| I -   RS485 Rts On Send   : No                                        |
| J -  RS485 Rts After Send : No                                        |
| K -  RS485 Rx During Tx   : No                                        |
| L -  RS485 Terminate Bus  : No                                        |
| M - RS485 Delay Rts Before: 0                                         |
| N - RS485 Delay Rts After : 0                                         |
|                                                                       |
|    Change which setting?                                              |
+-----------------------------------------------------------------------+
```

Fist, `A` to modify the `Serial device`. We need to specify the `tty` of the connected esp. For me this was `/dev/tty.usbserial-0001`. I think this might differ for others, so the quick way to check which serial device to use one can run `ls /dev | grep 'tty.*usb'` and unless there are multiple devices with serial port connected via an USB cable there should be only one result.

Once that's done, `Exit`, and here it is:

```
Welcome to minicom 2.9

OPTIONS: I18n
Compiled on Jan  1 1980, 00:00:00.
Port /dev/tty.usbserial-0001, 22:07:30

Press CTRL-A Z for help on special keys

0020 vaddr=00000020 size=0001ch (    28)
I (113) esp_image: segment 1: paddr=00010044 vaddr=3ffb0000 size=00104h (   260) load
I (122) esp_image: segment 2: paddr=00010150 vaddr=3�NG early entropy source...
*** Booting Zephyr OS build v3.6.0-1966-g3f218c6cdae0 ***
Hello World! esp32_devkitc_wroom/esp32/procpu  
```

A beautiful, rewarding, and underwhelming `Hello World!`.

Next I think I will try to run `Hello World!` with [hubris](https://github.com/oxidecomputer/hubris) which upon initial investigation seems to be way more complex as esp32 board isn't supported out of the box. Alternatively, I might try to get Zephyr up and running on a Solo instead. Either way, enough for one evening and more to come.
