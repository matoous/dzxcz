---
title: Keeping packages up to date
date: 2024-12-11
---

`brew upgrade` is a convenient way to update your packages to their latest version. The issue is, at one point or another not all your packages will be installed by `brew`.

To keep my system up to date I am using a tiny [fish](https://fishshell.com/) function that updates binaries installed through my most commonly used package managers, tools, and languages:

```fish
function update --description "Update binaries"
    brew update; and brew upgrade
    fisher update
    gup update
    npm update -g
    rustup update
    cargo install-update -a
end
```

Every now and then, I run `update` and get my whole system to latest version of tools. I tried [topgrade](https://github.com/topgrade-rs/topgrade) before, but it's heavyweight for my use case and often failed for (to me) unclear reasons. On the other hand, `update` function is less than 10 lines of code long and allows me to easily find the commands that run under the hood in case anything fails.
