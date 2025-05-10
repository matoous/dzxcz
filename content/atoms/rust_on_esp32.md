---
title: Rust on ESP32
date: 2025-05-08
---

I have been tinkering with [Walter](https://www.quickspot.io/index.html) - an ESP32-S3 module with NB-IoT, LTE-M, and GPS last week. Going the hard route a writing in Rust instead of using the [provided libraries](https://github.com/QuickSpot) for C++ and [MicroPython](https://micropython.org/).

To my understanding, there are multiple paths to take. Using the standard library (`std`) one can build on top of [ESP-IDF](https://github.com/espressif/esp-idf) (IoT Development Framework), a C-based development framework. This is the heavier, _batteries included_, approach where drivers for WiFi, networking, HTTP, MQTT, peripherals and more are all provided by the underlying system based on [FreeRTOS](https://www.freertos.org/). The alternative is `no_std`. This requires writing everything from scratch (or at least using the right libraries) but gives full control of memory, timing, and peripherals.

[Embassy](https://embassy.dev/) makes the `no_std` path easier. It's a framework that allows using `async`/`await` for efficient multi-tasking, bridging the gap between _write everything yourself_ and full blown-out [RTOS](https://en.wikipedia.org/wiki/Real-time_operating_system). Embassy takes care of scheduling, interrupts, and making sure the CPU sleeps when there's nothing to do. Embassy itself doesn't know anything about the underlying hardware, that's where [esp-hal-embassy](https://github.com/esp-rs/esp-hal/tree/main/esp-hal-embassy) comes in as a glue between the hardware abstraction layer and the Embassy framework, providing async-aware drivers for ESP hardware and timers and interrupts to drive the async task system.
