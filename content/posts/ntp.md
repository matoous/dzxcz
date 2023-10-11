---
title: "Hey computer, what's the time?"
date: 2023-10-07
slug: ntp
draft: true
tags: ["protocol", "writing", "software"]
---

Hello! This week I read Tony Finch's [Where does my computer get the time from?](https://dotat.at/@/2023-05-26-whence-time.html) and decided to learn more about [Network Time Protocol (NTP)](https://en.wikipedia.org/wiki/Network_Time_Protocol). This is exploration of NTP from scratch.

## What is NTP?

NTP (Network Time Protocol) is a protocol used to synchronize the clocks by hundreds of millions of computers and devices. It's the protocol that keeps the time accurate on your computer, mobile phone, smart watch, in telecommunication, financial services, and even by Deutsche Bahn albeit with varying accuracy.

## The protocol

On MacOS you can interact with NTP server using the `sntp` tool:

```sh
> sntp time.nist.gov        
+0.084360 +/- 0.155989 time.nist.gov 132.163.96.6
```

This command returns the time offset (`+0.084360` seconds) of local clock from the requested server and the precision (`+/- 0.155989` seconds).

Under the hood NTP works over UDP and relies on single datagram for all packets:

```
 0                   1                   2                   3
 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
|LI | VN  |Mode |    Stratum     |     Poll      |  Precision   |
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
|                         Root Delay                            |
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
|                         Root Dispersion                       |
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
|                          Reference ID                         |
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
|                                                               |
+                     Reference Timestamp (64)                  +
|                                                               |
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
|                                                               |
+                      Origin Timestamp (64)                    +
|                                                               |
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
|                                                               |
+                      Receive Timestamp (64)                   +
|                                                               |
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
|                                                               |
+                      Transmit Timestamp (64)                  +
|                                                               |
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
|                                                               |
.                                                               .
.                    Extensions and trailers...                 .
.                                                               .
|                                                               |
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
```

Without extensions, the whole packet fits into 48 bytes. We need only a few lines of code to craft and send a packet on our own:

```rust
use std::net::UdpSocket;

fn main() {
    let socket = UdpSocket::bind("0.0.0.0:0").unwrap();

    let request: [u8; 48] = [
        0x23, 0x00, 0x00, 0x00, // LI, VN, Mode, Stratum, Poll, Precision
        0x00, 0x00, 0x00, 0x00, // Root delay
        0x00, 0x00, 0x00, 0x00, // Root dispersion
        0x00, 0x00, 0x00, 0x00, // Reference identifier
        0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, // Reference timestamp
        0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, // Originate timestamp
        0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, // Receive timestamp
        0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, // Transmit timestamp
    ];

    socket.send_to(&request, "132.163.96.1:123").unwrap();
    println!("packet sent!");

    let mut buf = [0; 48];
    let (amt, src) = socket.recv_from(&mut buf).unwrap();
    println!("received {} byte from {}:\n {:?}", amt, src, buf);
}
```

Let's break it down, first we need an UDP socket. We _bind_ one on IP address `0.0.0.0` (the default address) and port `0` letting the OS assign the port for us.

{{< highlight rust "linenos=table,hl_lines=1 4" >}}
use std::net::UdpSocket;

fn main() {
    let socket = UdpSocket::bind("0.0.0.0:0").unwrap();
}
{{< / highlight >}}

Let's break it down, first we need an UDP socket. We _bind_ one on IP address `0.0.0.0` (the default address) and port `0` letting the OS assign the port for us.

{{< highlight rust "linenos=table,hl_lines=6-15" >}}
use std::net::UdpSocket;

fn main() {
    let socket = UdpSocket::bind("0.0.0.0:0").unwrap();

    let request: [u8; 48] = [
        0x23, 0x00, 0x00, 0x00, // LI, VN, Mode, Stratum, Poll, Precision
        0x00, 0x00, 0x00, 0x00, // Root delay
        0x00, 0x00, 0x00, 0x00, // Root dispersion
        0x00, 0x00, 0x00, 0x00, // Reference identifier
        0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, // Reference timestamp
        0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, // Originate timestamp
        0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, // Receive timestamp
        0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, // Transmit timestamp
    ];
}
{{< / highlight >}}

We only need to set first byte of the request. In order:

- **Leap Indicator (LI)** (2 bits) warning of an impending leap second to be inserted or deleted in the last minute of the current month.
  ```
  +-------+----------------------------------------+
  | Value | Meaning                                |
  +-------+----------------------------------------+
  | 0     | no warning                             |
  | 1     | last minute of the day has 61 seconds  |
  | 2     | last minute of the day has 59 seconds  |
  | 3     | unknown (clock unsynchronized)         |
  +-------+----------------------------------------+
  ```
- **Version Number (VN)** (3 bits) integer representing the NTP version number, currently 4. Latest version is version 4 from 2012.[^rfc4905]
- **Mode** (3 bits) field indicates the mode of the packet. Client requests have _Mode_ = 3.
  ```
  +-------+--------------------------+
  | Value | Meaning                  |
  +-------+--------------------------+
  | 0     | reserved                 |
  | 1     | symmetric active         |
  | 2     | symmetric passive        |
  | 3     | client                   |
  | 4     | server                   |
  | 5     | broadcast                |
  | 6     | NTP control message      |
  | 7     | reserved for private use |
  +-------+--------------------------+
  ```

Next we need to actuall send the packet to the NTP server. NTP servers run on port `123`. We also need to pick a server to send the packet to. There's large selection of primary server listed in [_Overview of popular public NTP servers_](https://gist.github.com/mutin-sa/eea1c396b1e610a2da1e5550d94b0453). We can pick `time.nist.gov` for example, to avoid plumbing DNS resolution in, we need the IP address though:

```sh
> dig +short time.nist.gov
ntp1.glb.nist.gov.
132.163.96.4
```

Let's send the pocket:

{{< highlight rust "linenos=table,hl_lines=17-18" >}}
use std::net::UdpSocket;

fn main() {
    let socket = UdpSocket::bind("0.0.0.0:0").unwrap();

    let request: [u8; 48] = [
        0x23, 0x00, 0x00, 0x00, // LI, VN, Mode, Stratum, Poll, Precision
        0x00, 0x00, 0x00, 0x00, // Root delay
        0x00, 0x00, 0x00, 0x00, // Root dispersion
        0x00, 0x00, 0x00, 0x00, // Reference identifier
        0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, // Reference timestamp
        0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, // Originate timestamp
        0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, // Receive timestamp
        0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, // Transmit timestamp
    ];

    socket.send_to(&request, "132.163.96.4:123");
    println!("packet sent!");
}
{{< / highlight >}}

There's last piece missing - obtaining the response from the NTP server. We already have the UDP socket binded, what we need is to receive the response packet.

{{< highlight rust "linenos=table,hl_lines=20-22" >}}
use std::net::UdpSocket;

fn main() {
    let socket = UdpSocket::bind("0.0.0.0:0").unwrap();

    let request: [u8; 48] = [
        0x23, 0x00, 0x00, 0x00, // LI, VN, Mode, Stratum, Poll, Precision
        0x00, 0x00, 0x00, 0x00, // Root delay
        0x00, 0x00, 0x00, 0x00, // Root dispersion
        0x00, 0x00, 0x00, 0x00, // Reference identifier
        0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, // Reference timestamp
        0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, // Originate timestamp
        0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, // Receive timestamp
        0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, // Transmit timestamp
    ];

    socket.send_to(&request, "132.163.96.1:123").unwrap();
    println!("packet sent!");

    let mut buf = [0; 48];
    let (amt, src) = socket.recv_from(&mut buf).unwrap();
    println!("received {} byte from {}:\n {:?}", amt, src, buf);
}
{{< / highlight >}}

We can finally run our little NTP example:

```sh
> cargo run
   Compiling ntp-rs v0.1.0 (/Users/admin/code/github.com/matoous/ntp.rs)
    Finished dev [unoptimized + debuginfo] target(s) in 1.47s
     Running `target/debug/ntp-rs`
packet sent!
received 48 byte from 132.163.96.1:123:
 [28, 1, 13, 227, 0, 0, 0, 16, 0, 0, 0, 32, 78, 73, 83, 84, 232, 204, 46, 128, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 232, 204, 46, 195, 51, 24, 196, 148, 232, 204, 46, 195, 51, 24, 224, 238]
```

Slightly underwhelming, but the important stuff is there! We have received an NTP Server response. To decode it, we will first need two helpers:

```rust
use std::time::{Duration, SystemTime, UNIX_EPOCH};

fn ntp_duration(val: u32) -> Duration {
    let seconds: u64 = (val >> 16) as u64;
    let fraction: u64 = (val & 0xFFFF) as u64;
    let nanos: u64 = (fraction * 1_000_000_000) / 65536;
    Duration::new(seconds, nanos as u32)
}

fn ntp_timestamp(val: u64) -> SystemTime {
    let seconds_since_ntp_epoch = (val >> 32) as u64;
    let seconds_since_unix_epoch = seconds_since_ntp_epoch - 2_208_988_800;
    let fractional_seconds = (val & 0xFFFFFFFF) as u64;
    let nanos = (fractional_seconds * 1_000_000_000) >> 32;
    UNIX_EPOCH + Duration::new(seconds_since_unix_epoch, nanos as u32)
}
```

NTP timestamps use offset from 1 Jan 1900 as compared to Unix time that uses January 1, 1970. This requires some manipulation on our side to convert to time types from Rust standard library.[^ntp_timestamps]

With these two helpers we are equipped to parse the whole response:

```rust
let leap_indicator = buf[0] >> 6;
let version = (buf[0] & 0b00111000) >> 3;
let mode = buf[0] & 0b00000111;
let stratum_level = buf[1];
let polling_interval = buf[2];
let precision = buf[3];

let root_delay = ntp_duration(u32::from_be_bytes(buf[4..8].try_into().unwrap()));
let root_dispersion = ntp_duration(u32::from_be_bytes(buf[8..12].try_into().unwrap()));
let reference_id = std::str::from_utf8(&buf[12..16]).unwrap();
let reference_timestamp = ntp_timestamp(u64::from_be_bytes(buf[16..24].try_into().unwrap()));
let receive_timestamp = ntp_timestamp(u64::from_be_bytes(buf[32..40].try_into().unwrap()));
let transmit_timestamp = ntp_timestamp(u64::from_be_bytes(buf[40..48].try_into().unwrap()));
```

and all that's left is to print the data for our amusement:

```rust
println!("received {} byte from {}:\n {:?}", amt, src, buf);
println!(
    "leap indicator: {}, version: {}, mode: {}",
    leap_indicator, version, mode
);
println!("stratum level: {:x?}", stratum_level);
println!("polling interval: {}s", 2_i32.pow(polling_interval as u32));
println!("precision: {}s", 2_f32.powf(precision as i8 as f32));
println!("root delay: {:?}", root_delay);
println!("root dispersion: {:?}", root_dispersion);
println!("reference ID: {:?}", reference_id);
println!("reference timestamp: {:?}", reference_timestamp);
println!("receive timestamp: {:?}", receive_timestamp);
println!("transmit timestamp: {:?}", transmit_timestamp);
```

Running our Rust script again should yield something like:

```sh
> cargo run
    Finished dev [unoptimized + debuginfo] target(s) in 0.00s
     Running `target/debug/ntp-rs`
Packet sent!
received 48 byte from 132.163.97.6:123:
 [28, 1, 13, 227, 0, 0, 0, 16, 0, 0, 0, 32, 78, 73, 83, 84, 232, 204, 237, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 232, 204, 237, 28, 136, 29, 211, 186, 232, 204, 237, 28, 136, 29, 239, 234]
leap indicator: 0, version: 3, mode: 4
stratum level: 1
polling interval: 8192s
precision: 0.0000000018626451s
root delay: 244.14µs
root dispersion: 488.281µs
reference ID: "NIST"
reference timestamp: SystemTime { tv_sec: 1696755328, tv_nsec: 0 }
receive timestamp: SystemTime { tv_sec: 1696755356, tv_nsec: 531705124 }
transmit timestamp: SystemTime { tv_sec: 1696755356, tv_nsec: 531706804 }
```

We can also verify that the timestamps match our expectations by converting them to human readable string:

```sh
> date -r 1696755356      
Sun Oct  8 10:55:56 CEST 2023
```

In the example above you can notice that we use `SystemTime`, system time is a clock maintained by the hardware and operating system while the frequently used Coordinated Universal Time (UTC) timescale represents mean solar time as specified by national standards laboratories. The goal of NTP is to minimize the time difference between UTC and the system clock.

## Notes


---

- For fully functioning NTP rust implementation see [pendulum-project/ntpd-rs](https://github.com/pendulum-project/ntpd-rs).
- [chrony](https://chrony-project.org/) is one of the popular OS NTP implementations.

[^ntp_timestamps]: [NTP Timestamp Calculations](https://www.ntp.org/reflib/time/)
[^finch]: [Where does my computer get the time from?](https://dotat.at/@/2023-05-26-whence-time.html) by Tony Finch
[^rfc4905]: [RFC 5905 - Network Time Protocol Version 4: Protocol and Algorithms Specification](https://datatracker.ietf.org/doc/html/rfc5905)
[^gps_pi]: [Microsecond accurate NTP with a Raspberry Pi and PPS GPS](https://austinsnerdythings.com/2021/04/19/microsecond-accurate-ntp-with-a-raspberry-pi-and-pps-gps/)
