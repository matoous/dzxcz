---
title: Notes on Nix
date: 2024-03-10
---

Over the weekned I switched most of my MacOS setup from [homebrew](https://brew.sh/) to [Nix](https://nixos.org/). You can find the new _home_ at [github.com/matoous/nix-hoome](https://github.com/matoous/nix-home). To be frank, I know little about Nix which is famous for its steep learning curve so I ended up copying and stitching together code from google and people I follow.

Nix allows multiple different versions of the same binary to be installed at the same time which helps with avoiding collisions and allows different tools to be udpated independently.One can do something similar with `homebrew` as well, e.g. installing Qt version five using: `brew install qt@5`, but to my understanding one is way more limited because of the dependency chain.

- To go over historical versions of specific package see [nix-versions](https://lazamar.co.uk/nix-versions/?channel=nixpkgs-unstable&package=nodejs).
- Install the package using `nix-env -iA`, e.g. `nix-env -iA nodejs_20 -f https://github.com/NixOS/nixpkgs/archive/9957cd48326fe8dbd52fdc50dd2502307f188b0d.tar.gz`

Previously, nix used multiple different command for different things. E.g. `nix-env` for installing packages into the environment, `nix-shell` to init a nix shell, etc. Nowadays, all of these seem to be available under the `nix` command which you need to enable using `~/.config/nix/nix.conf`:

```conf
experimental-features = nix-command flakes
```

There are a few promising things about Nix that I want to explore:

- With nix it is easy to provision developer environment per-repository. One can do so by adding a [flake](https://nixos.wiki/wiki/Flakes) that configures all required tools for development.
- There's [NixOS](https://nixos.org/manual/nixos/stable/) which allow whole OS to be declaratively configured using Nix.
- You can build packages using Nix which builds them in isolations using specific versions of dependencies which ensures that you will get a consistent result.

That's it for now, I will keep on toying around with Nix and see what more there is to it. For now, I manage my dot files and tools using [home-manager](https://github.com/nix-community/home-manager) and started experimenting with using Nix to cross-compile software for [Solo](https://www.sumup.com/en-us/solo-card-reader/).
