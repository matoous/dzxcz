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
  PLACEHOLDER
```

We need only a few lines of code to send a packet:

```rs
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

- **Leap Indicator (LI)** (2 bits) indicates whether a leap second adjustment is to be made at the end of the current month. This is set by the server.
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
- **Version Number (VN)** (3 bits) indicates the version number of the NTP protocol in use. Latest version is version 4 from 2012.[^rfc4905]
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

Slightly underwhelming, but the important stuff is there. The important part are bytes 17 - 24. There bytes are the _Reference Timestamp_ - the time at which the server's clock was last set or corrected, in NTP timestamp format.
 
- **Stratum** (8 bits) is roughly speaking the level of the server in the hiearchy. Servers of level 1 are primary servers with accurate clock source such as GPS receiver or atomic clock. Check Tony Finch's [Where does my computer get the time from?](https://dotat.at/@/2023-05-26-whence-time.html) for more details.
  ```
  +--------+-----------------------------------------------------+
  | Value  | Meaning                                             |
  +--------+-----------------------------------------------------+
  | 0      | unspecified or invalid                              |
  | 1      | primary server (e.g., equipped with a GPS receiver) |
  | 2-15   | secondary server (via NTP)                          |
  | 16     | unsynchronized                                      |
  | 17-255 | reserved                                            |
  +--------+-----------------------------------------------------+
  ```



---

[chrony](https://chrony-project.org/)



[^finch]: [Where does my computer get the time from?](https://dotat.at/@/2023-05-26-whence-time.html) by Tony Finch
[^rfc4905]: [RFC 5905 - Network Time Protocol Version 4: Protocol and Algorithms Specification](https://datatracker.ietf.org/doc/html/rfc5905)
[^gps_pi]: [Microsecond accurate NTP with a Raspberry Pi and PPS GPS](https://austinsnerdythings.com/2021/04/19/microsecond-accurate-ntp-with-a-raspberry-pi-and-pps-gps/)
