---
title: "Software"
summary: "Apps, tools, and setup I use on my macOS and iOS to get stuff done."
---

## Terminal

[Wezterm](https://wezfurlong.org/wezterm/) is my current terminal of choice.
I went through [Hyper](https://hyper.is/), [iTerm2](https://iterm2.com/), and [Kitty](https://sw.kovidgoyal.net/kitty/)
before. Each time sacrificing a little bit of the features (that I mostly didn't use anyway) in favor of speed.
And when it comes to speed, wezterm is pefect. Instant boot time, GPU-accelerated, and it is written in Rust,
so when I feel like learning a little bit more about Rust or contributing, I can do so.

## Shell

I run [Zsh](https://www.zsh.org/) and [Oh My Zsh](https://ohmyz.sh/) for as long as I can remember.
Initially I used a lot of the provided plugins, full blown out [Spacship ZSH](https://github.com/spaceship-prompt/spaceship-prompt) prompt,
and material theme.

Nowadays I use fairly minimal configuration of [Starship](https://starship.rs/) prompt (basically only directory and git information).
20 or so oh-my-zsh plugins were reduced to 3: `zsh-syntax-highlighting`, `zsh-completions`, and `history-substring-search`.
And I have all shell config in single `.zshrc` file.

## Editor

![Terminal](../terminal.png)

[Helix](https://github.com/helix-editor/helix) for almost everything, sometimes I still spin up one of the JetBrains IDEs for larger
refactors or debugging.

In University we had free licenses for [JetBrain](https://www.jetbrains.com/) products so I used those since I started programming. Whenever I needed to edit
something in terminal I would use [Nano](https://help.ubuntu.com/community/Nano) as Vim was still far in the mystery land for me.
As I needed to edit more and more configuration files and sometimes do so remotely I decided to learn Vim in February 2021.
The learning curve is indeed steep but I enjoyed it a lot. Slowly my configuration grew like crazy I not long after I had almost full IDE
experience, especially thanks to [LSP](https://microsoft.github.io/language-server-protocol/) support and [Tree-Sitter](https://tree-sitter.github.io/tree-sitter/).

As with other tools, I started to look around for how to minimize the setup. I ditched a few plugins, removed all unnecessary configuration, yet
as it happens with nvim, my config was still hundreds of lines. That is, until I found Helix.

[Helix](https://github.com/helix-editor/helix) feels very similar to Vim but works very differently. While in Vim you start with
`action` followed by `motion` (e.g. `d3w` to delete 3 words) Helix follows `section` -> `action` model. That means that
whatever you are going to act on (words, function, line, etc.) is selected first and the action is second. It's striking difference from
Vim that takes some time to get used to but comes very naturally. Second large difference is first-class support for multicursor.
Where in Vim you would substitue using the `%s/SEARCH/REPLACE/g` pattern in Helix you select the text (e.g. `%` for whole file),
select the pattern in the selection (e.g. `s` followed by the term you are searching for), by confirming the selection you
create multiple individual selections and now you can edit all of them at once. Multiselection is super powerful thing
with many usecases that is now crucial part of my editing toolkit.

## Tools

- [ag](https://github.com/ggreer/the_silver_searcher) for code search
- [sd](https://github.com/chmln/sd) for search and replace
- [jq](https://stedolan.github.io/jq/) for JSON
- [yq](https://github.com/mikefarah/yq) for YAML
- [fd](https://github.com/sharkdp/fd) for finding files
- [git](https://github.com/git/git) for version control obviously.
- [HTTPie](https://httpie.org/) for HTTP
- [fzf](https://github.com/junegunn/fzf) 
- [exa](https://github.com/ogham/exa) modern alternative to `ls`
- [htop](https://htop.dev/) - interactive process viewer
- [pandoc](https://github.com/jgm/pandoc) for documents and markdown, convert anything to anything
- [Mackup](https://github.com/lra/mackup) for dotfiles backup
- [ffsend](https://github.com/timvisee/ffsend) to share files from terminal
- [hugo](https://github.com/gohugoio/hugo) for static websites
- [dive](https://github.com/wagoodman/dive) for exploring docker images
- [gist](https://github.com/defunkt/gist) for uploading stuff to gist
- [youtube-dl](https://ytdl-org.github.io/youtube-dl/index.html) for downloading my favorite DJ sets from youtube
- [bat](https://github.com/sharkdp/bat) - `cat` alternative with colors and more
- [trash](https://github.com/ali-rantakari/trash) to not shoot myself in the leg when running `rm`
- [k9s](https://github.com/derailed/k9s) for managing kubernetes stuff
- [kubectx](https://github.com/ahmetb/kubectx) to switch between kube contexts
- [imagemagick](https://github.com/ImageMagick/ImageMagick) to manipulate, resize, and convert images
- [glow](https://github.com/charmbracelet/glow) for markdown files
- [loc](https://github.com/cgag/loc) to count lines of code in a codebase
- [neofetch](https://github.com/dylanaraps/neofetch) for fun
- [pgcli](https://www.pgcli.com/) as a better alternative to the default `psql`
- [q](https://github.com/harelba/q) to run SQL over csv files
- [rsync](https://linux.die.net/man/1/rsync) for synchronization between machines
- [teleport](https://goteleport.com/) for access to clusters and machines

## Apps

- [1Password](https://1password.com/) for passwords management
- [Alfred](https://www.alfredapp.com/) for shortcuts
- [balenaEtcher](https://www.balena.io/etcher/) for flashing OS images to SD crds & USB driver
- [boop](https://github.com/IvanMathy/Boop) tool for text wrangling and small utilities
- [fanny](https://github.com/DanielStormApps/Fanny) for CPU/GPU/Fans monitoring
- [IINA](https://github.com/iina/iina) for videos
- [Insomnia](https://github.com/Kong/insomnia) - API client
- [Itsycal](https://github.com/sfsam/Itsycal) - tiny calendar for menu bar
- [Maccy](https://github.com/p0deje/Maccy) for clipboard management and history
- [Amphetamine](https://apps.apple.com/us/app/amphetamine/id937984704?mt=12) for preventing the MacOS from sleeping

## Other

- *Wallpapers*: [OS9 Walppapers](https://www.arun.is/blog/os9-wallpaper/) by [Arun](https://www.arun.is/)
- *Screen Saver*: [Brooklyn](https://github.com/pedrommcarrasco/Brooklyn) or [Fliqlo](https://fliqlo.com/)
- *Font*: [JetBrains Mono](https://www.jetbrains.com/lp/mono/)

