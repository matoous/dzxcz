---
title: "How to setup you terminal on MacOS for powerusers"
date: 2020-05-17
slug: terminal_setup
draft: false
tags: ["code", "terminal", "writing"]
---

If you spend a lot of time in terminal and want to get the most out of it, this is the guide for you.
I will go through MacOS terminal setup from zero to _"GUI? Why would use that?"_.
Before you get started, I must warn you, this is an opinionated guide and I will mostly recommend what
I personally like and use. Have that in mind and don't forget to try multiple things, to see what fits
you best. Also, this guide is mostly to show all the fun stuff you can do from terminal. If you
want to learn useful things with basic terminal setup try [The Art of Command Line](https://github.com/jlevy/the-art-of-command-line).

If you don't have any experience with terminal but would like to learn more, try starting with this
introduction [Discovering the terminal](https://blog.balthazar-rouberol.com/discovering-the-terminal).
When you get more confident with terminal feel free to return here and learn more!

## Install Homebrew

[Homebrew](https://brew.sh/) is a free, open-source software package manager for MacOS (and Linux too) that simplifies
installation of applications and packages on your system. Simplifies might be an understatement here because
with it doesn't get much easier than writing `brew cask install microsoft-word`.

To install Homebrew run:

```shell script
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install.sh)"
```

This will take you through the installation process. Before any changes the script will inform you what it
will do and will wait for your confirmation. When the script completes you are all set and done.
From now on, you can install and update almost anything using Homebrew.
Your daily usage of homebrew will consist of `brew install [aplication]` and `brew cask install [aplication]`.
In general, `brew install` is for CLI tools and applications, and `brew cask install` is for full-featured GUI
applications that you would otherwise install by downloading their binary from the website or app store.
And once in a while, if you remember, update all your tools to their latest version using `brew upgrade`.

Brew has of course many more features but for the purpose of this article we won't need much more.
If you still want to learn more, visit the [official documentation](https://docs.brew.sh/).

## Install iTerm 2

[iTerm 2](https://iterm2.com/index.html) is terminal emulator for MacOS that has plenty of cool features and settings.
You don't need it and can use the default `Terminal.app` that comes shipped with all MacOS distributions but you
would deprive yourself of many cool features.

```shell script
brew cask install iterm2
```

Among the many cool features of iTerm 2 you will find things such as split pane, paste history, profiles, trigger,
and much more. You can read about the various feature [here](https://iterm2.com/features.html).

Now, you might not like the default colors of iTerm 2. Before changing the theme though, I recommend you finish
the ZSH installation so your terminal actually uses some colors, because by default, it doesn't.
To try out multiple color themes first download the color themes zip file from [iterm2colorschemes.com/](https://iterm2colorschemes.com/).
Unpack it and then go to your iTerm to `iTerm 2 > Preferences... > Profiles > Colors`.
In the bottom right corner click `Color Presets... > Import...` and select all the themes in `schemes` folder
in the extracted directory. This will import all the themes into iTerm and you will be able to easily change
them by selecting them from the `Color Presets`. Eventually you will find out which one you like,
or you will get stuck changing them forever, who knows...

The theme is really a matter of personal preference. I was looking for a dark theme with high contrast colors
and found out, that the _Symphonic_ theme suits me the best. You go ahead, I try out what is best for you.

## Install ZSH

[ZSH](https://www.zsh.org/) or _Z Shell_ is shell designed for interactive use. ZSH incorporates many features
from other shells such as _bash_, _ksh_, or _tcsh_. This includes but is not limited to: file globbing,
shell functions, aliasing, parameters substitution and [more](https://zsh.sourceforge.net/Intro/intro_toc.html).
To install ZSH run:

```shell script
brew install zsh
```

## Install Oh My Zsh

["Oh My ZSH!"](https://ohmyz.sh/) is a open source, community-driven framework for Zsh configuration management.
It comes bundled with functions, helpers, plugins, themes, and more... Install Oh My ZSH by running:

```shell script
sh -c "$(curl -fsSL https://raw.githubusercontent.com/robbyrussell/oh-my-zsh/master/tools/install.sh)"
```

Best thing about Oh My Zsh is the plugins, you can find most of them in the exhausting
[Plugins Overview](https://github.com/ohmyzsh/ohmyzsh/wiki/Plugins-Overview) and there's even more exhausting
list without descriptions on the [Plugins wiki page](https://github.com/ohmyzsh/ohmyzsh/wiki/Plugins).
Plugins are enabled by listing them in `plugins` variable in your `~/.zshrc` and Oh My ZSH will take care of the rest
(installation, updates, etc.).

```shell script
# ZSH plugins
plugins=(
  git
  docker
  copyfile # copy the content of a file
  encode64 # encode to base64
  extract # extract any type of archvie
  web-search # search for something on internet: ddg cat, google dog
  git-extras # super cool autocompletion for git command
  httpie # completion for httpie
  catimg # cat but for images
  ...
)
```

Oh My ZSH provides also tones of themes to select from, all listed
[ZSH Github Wiki - Themes Page](https://github.com/ohmyzsh/ohmyzsh/wiki/Themes#theme-description-format)
but in this tutorial, we will install Powerlevel10k, the one that I like the most
(and trusty me, I have tried quite a few).

## Install Powerlevel10k

> Powerlevel10k is a theme for Zsh. It emphasizes speed, flexibility and out-of-the-box experience.

Indeed, Powerlevel10k is super fast, flexible and can be configured to your liking. If you want
to experience the speed yourself, I recommend installing Powerlevel9k first and sticking with it
for a few days, then installing Powerlevel10k, you won't believe your eyes. Install Powerlevel10k
using:

```shell script
git clone --depth=1 https://github.com/romkatv/powerlevel10k $ZSH_CUSTOM/themes/powerlevel10k
```

And set `ZSH_THEME="powerlevel10k/powerlevel10k"` in `~/.zshrc`. To configure the theme and set style
and options that you prefer run:

```shell script
p10k configure
```

This will take you through the setup process where you will step by step select what you prefer and like.
If you are unhappy with the result it's ok to run the `p10k configure` again.

I use the _[Pure](https://github.com/sindresorhus/pure)_ setup because I used _Pure_ before, liked the lean and clear style,
but missed the speed of powerlevel.

## Shell productivity

Above programs and tools provide many features that can speed things up but first one needs to learn them.
Since writing about shell shortcuts, navigation, expansions, etc. would be for one article itself I will just
point you to this awesome [Shell productivity tips and tricks](https://blog.balthazar-rouberol.com/shell-productivity-tips-and-tricks.html)
guide by [Balthazar Rouberol](https://blog.balthazar-rouberol.com/).

## The Fun

We installed Homebrew, iTerm 2, ZSH, Oh My ZSH and Powelevel10k; if you still bare with me - now the fun begins,
I promise. We have nice, lean and fast terminal but what kind of amateurs would we be if we didn't do absolutely
everything we can from the comfort of commandline. For example, what if you want to check what's the weather like?
Pretty simple right? We can google it. But that would be lame and simple, instead, lets add the following function to our
`~/.zshrc`:

```shell script
weather(){
  if [ $# -eq 0 ]; then curl wttr.in; else http "wttr.in/$1"; fi
}
```

then source the `~/.zshrc` file: `source ~/.zshrc` and try it out:

```shell script
$ weather berlin
Weather report: berlin

    \  /       Partly cloudy
  _ /"".-.     -1..+1 °C
    \_(   ).   → 6 km/h
    /(___(__)  10 km
               3.0 mm
                                                       ┌─────────────┐
┌──────────────────────────────┬───────────────────────┤  Mon 30 Mar ├───────────────────────┬──────────────────────────────┐
│            Morning           │             Noon      └──────┬──────┘     Evening           │             Night            │
├──────────────────────────────┼──────────────────────────────┼──────────────────────────────┼──────────────────────────────┤
│    \  /       Partly cloudy  │               Overcast       │      .-.      Heavy snow     │  _`/"".-.     Patchy heavy s…│
│  _ /"".-.     -1..+2 °C      │      .--.     1..4 °C        │     (   ).    0..3 °C        │   ,\_(   ).   -2..+2 °C      │
│    \_(   ).   → 13-15 km/h   │   .-(    ).   → 17-19 km/h   │    (___(__)   ↘ 11-14 km/h   │    /(___(__)  ↖ 14-20 km/h   │
│    /(___(__)  10 km          │  (___.__)__)  10 km          │    * * * *    4 km           │     * * * *   8 km           │
│               0.0 mm | 0%    │               0.0 mm | 0%    │   * * * *     2.7 mm | 66%   │    * * * *    1.0 mm | 21%   │
└──────────────────────────────┴──────────────────────────────┴──────────────────────────────┴──────────────────────────────┘
                                                       ┌─────────────┐
┌──────────────────────────────┬───────────────────────┤  Tue 31 Mar ├───────────────────────┬──────────────────────────────┐
│            Morning           │             Noon      └──────┬──────┘     Evening           │             Night            │
├──────────────────────────────┼──────────────────────────────┼──────────────────────────────┼──────────────────────────────┤
│    \  /       Partly cloudy  │               Overcast       │               Overcast       │  _`/"".-.     Patchy snow po…│
│  _ /"".-.     -1..+2 °C      │      .--.     2..4 °C        │      .--.     2..3 °C        │   ,\_(   ).   0 °C           │
│    \_(   ).   ↓ 10-11 km/h   │   .-(    ).   ↗ 11-12 km/h   │   .-(    ).   → 9-10 km/h    │    /(___(__)  ↗ 9-12 km/h    │
│    /(___(__)  10 km          │  (___.__)__)  10 km          │  (___.__)__)  9 km           │      ‘ * ‘ *  10 km          │
│               0.0 mm | 0%    │               0.0 mm | 0%    │               0.0 mm | 0%    │     * ‘ * ‘   0.0 mm | 0%    │
└──────────────────────────────┴──────────────────────────────┴──────────────────────────────┴──────────────────────────────┘
                                                       ┌─────────────┐
┌──────────────────────────────┬───────────────────────┤  Wed 01 Apr ├───────────────────────┬──────────────────────────────┐
│            Morning           │             Noon      └──────┬──────┘     Evening           │             Night            │
├──────────────────────────────┼──────────────────────────────┼──────────────────────────────┼──────────────────────────────┤
│    \  /       Partly cloudy  │               Cloudy         │  _`/"".-.     Patchy rain po…│               Overcast       │
│  _ /"".-.     0..4 °C        │      .--.     4..7 °C        │   ,\_(   ).   3..6 °C        │      .--.     2..5 °C        │
│    \_(   ).   ↗ 17-21 km/h   │   .-(    ).   → 18-21 km/h   │    /(___(__)  → 16-24 km/h   │   .-(    ).   → 15-24 km/h   │
│    /(___(__)  10 km          │  (___.__)__)  10 km          │      ‘ ‘ ‘ ‘  10 km          │  (___.__)__)  10 km          │
│               0.0 mm | 0%    │               0.0 mm | 0%    │     ‘ ‘ ‘ ‘   0.0 mm | 29%   │               0.1 mm | 52%   │
└──────────────────────────────┴──────────────────────────────┴──────────────────────────────┴──────────────────────────────┘
Location: Berlin [52.52045,13.40732]

Follow @igor_chubin for wttr.in updates
```

From now on, you don't ever need to leave the command line if you need to know if it's raining outside.
And we are just getting started...

## Essential CLI Tools

1. _[ag - The Silver Searcher](https://github.com/ggreer/the_silver_searcher)_ -
   crazy fast code searching tool similar to `ack`.

   Install with:
   `brew install the_silver_searcher`

2. _[jq](https://stedolan.github.io/jq/)_ - flexible and lightweight JSON processor that
   allows you to slice, transform, map and filter JSON data with eas.

   Install with:
   `brew install jq`

3. _[HTTPie](https://httpie.org/)_ - `curl`/`wget` alternative with highlighting,
   JSON support, plugins and much more.

   Install using:
   `brew install httpie`

4. _[fzf](https://github.com/junegunn/fzf)_ - command line fuzzy finder for anything.
   With `fzf` you can easily search for files, directories, commands from history and
   more using fuzzy matching.

   Install using:
   `brew install fzf`\
   and to enable useful key bindings:
   `$(brew --prefix)/opt/fzf/install`

5. _[exa](https://github.com/ogham/exa)_ - modern alternative to `ls`.
   Exa ships with better defaults and colorful highlighting, it has also
   support for git, symlinks and file attributes and is written in rust,
   so it is super fast.

   Install using:
   `brew install exa`

   Example:

   ```shell script
   $ exa --group-directories-first -T go-nanoid
   go-nanoid
   ├── examples
   │  └── simple_example.go
   ├── go.mod
   ├── gonanoid.go
   ├── gonanoid_test.go
   ├── LICENSE
   ├── Makefile
   └── README.md
   ```

6. _[noti](https://github.com/variadico/noti)_ - monitor for processes that
   triggers notification once the process completes. Nice thing for long
   builds, uploads or downloads, and other long running scripts.

   Install using:
   `brew install noti`

   Example:
   `noti youtube-dl --extract-audio https://www.youtube.com/watch\?v\=iha_VCBfQMo`

7. _[tldr](https://tldr.sh/)_ - simplified man pages with examples, for whenever
   you forget the command usage and don't want to read through thousands of lines
   of man page to find the flag you are looking for. (On the other hand, `tldr` is
   sometimes too brief).

   Install using:
   `brew install tldr`

   Example:

   ```shell script
   $ tldr cat

   cat

   Print and concatenate files.

   - Print the contents of a file to the standard output:
      cat file

   - Concatenate several files into the target file:
      cat file1 file2 > target_file

   - Append several files into the target file:
      cat file1 file2 >> target_file

   - Number all output lines:
      cat -n file

   - Display non-printable and whitespace characters (with `M-` prefix if non-ASCII):
      cat -v -t -e file
   ```

8. _[Mackup](https://github.com/lra/mackup)_ - backup and keep your application settings in sync.
   Mackup supports multiple storages for backup - Dropbox, Google Drive, iCloud and more.

   Install using:
   `brew install mackup`

   Example:
   `mackup backup`

9. _[ffsend](https://github.com/timvisee/ffsend)_ - easily and securely share files from the command line
   using Firefox Send. `ffsend` has also many useful features such as protecting
   the shared file with password or limiting the number of downloads.

   Install using:
   `brew install ffsend`

   Example:
   `ffsend upload folder/ --archive --copy --no-interact --download-limit=1`
   (shares whole folder, zipped, limits the number of downloads to one and copies
   the URL of the file to your clipboard)

10. _[gist](https://github.com/defunkt/gist)_ - upload content to [gist.github.com](https://gist.github.com/discover).
    Gist makes it easy to share code snippets, simple markdown files and more, all from
    the command line.

    Install using:
    `brew install gist`

    Example:
    `then gist -p -c README.md` (creates private gist with README.md and copies
    the URL into your clipboard)

11. _[youtube-dl](https://ytdl-org.github.io/youtube-dl/index.html)_ - download videos, audio or whole playlists
    from youtube.

    Install using:
    `brew install youtube-dl`

    Example:
    `youtube-dl --extract-audio https://www.youtube.com/watch\?v\=iha_VCBfQMo`

12. _[bat]()_ - `cat` alternative with colors and more.

    Install using:
    `brew install bat`

    Example:
    `bat -A .gitconfig`

## Making it easier with aliases

I introduced you to tones of tools that you most probably already forgot before getting to this line.
Also, if you are lazy like me, you don't want to write the whole command every single time. Solution?
Aliases. Lets type less and do more with following:

1. Navigation - here's a few aliases that make the navigation easier

   ```shell script
   alias ..="cd .."
   alias ...="cd ../.."
   alias ....="cd ../../.."
   alias .....="cd ../../../.."
   alias ~="cd ~" # `cd` is probably faster to type though
   alias -- -="cd -" # switch between old and present working directory
   ```

2. Alternatives - I use a lot of alternatives to common tools so I override them using aliases

   ```shell script
   alias cat="bat"
   alias download="http --follow --download"
   alias diff="colordiff"
   alias diff="colordiff"
   alias rm="trash" # this is a live saver
   alias ls="exa --group-directories-first"
   ```

3. Shortcuts - lets create shorter names for commands that are used often

   ```shell script
   alias g="git"
   alias reload!='. ~/.zshrc'
   alias x="exit"
   alias sz="source ~/.zshrc"
   alias ls="exa --group-directories-first"
   alias lst="exa --group-directories-first -T"
   alias ll="exa --group-directories-first -l"
   alias la="exa --group-directories-first -a"
   alias lat="exa --group-directories-first -a -T"
   alias path='echo -e ${PATH//:/\\n}'
   ```

4. Fun - some other fun shorthands that are pretty much useless but nice to have.

   ```shell script
   # Stuff I never really use but cannot delete either because of https://xkcd.com/530/
   # original aliases used 'muted true' instead of 'volume 0', I find this better
   alias stfu="osascript -e 'set volume output volume 0'"
   alias pumpit="osascript -e 'set volume output volume 100'"

   alias afk="/System/Library/CoreServices/ScreenSaverEngine.app/Contents/MacOS/ScreenSaverEngine"
   alias sleep="pmset sleepnow"
   ```

## Functions

Last but not least, there are things for which aliases are short or you need additional logic. That's
where function come in handy, again, here's a list of the ones I use in no particular order. (Except
the first one, that's my love).

1. Share anything from command line - I already talked about the `ffsend` command for sharing but this
   functions takes it step further:

   ```shell script
   # share file for one download only, uses https://github.com/timvisee/ffsend
   share(){
     ffsend upload $1 --archive --copy --no-interact --download-limit=1
   }
   ```

   This function will: archive the file (or files, or directory), upload it, set the download limit
   to 1 download and copy the link to the sharable URL to your clipboard. Pretty neat right!
   I use this anytime I get a request to share some photos (in reasonable size) or documents.

## Git Aliases

To speed up the development I also use bunch of git aliases so I can type less and do more.
These are mostly individual and depend on personal preferences but one that I found especially useful
in my day to day use is `cane = commit --amend --no-edit`. In our team at Kiwi.com we always do 1 commit
per MR, this means that I often add changes to already pushed commits and this alias makes it super
easy and fast.

```ini
[alias]
  w = switch
  hist = log --pretty=format:'%h %ad | %s%d [%an]' --graph --date=short
  type = cat-file -t
  dump = cat-file -p
  c = commit
  b = branch
  s = status
  p = pull
  d = diff
  lo = log --oneline -n 10
  unstage = reset HEAD
  pushf = push --force-with-lease
  cane = commit --amend --no-edit
[apply]
  whitespace = fix
[credential]
  helper = osxkeychain
[push]
  default = current
[rerere]
  enabled = true
```

---

### Other sources

1. [Text processing in the shell](https://blog.balthazar-rouberol.com/text-processing-in-the-shell)
2. [Linux Productivity Tools](https://www.usenix.org/sites/default/files/conference/protected-files/lisa19_maheshwari.pdf)
3. [nikitavoloboev/my-mac-os](https://github.com/nikitavoloboev/my-mac-os)
