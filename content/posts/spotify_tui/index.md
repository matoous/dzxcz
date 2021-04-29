---
title: "Spotify TUI"
date: 2021-04-16
slug: spotify_tui
draft: false
tags: ["terminal", writing"]
---

{{< picture src="screenshot.png" alt="Showcase of Spotify TUI" >}}

[Spotify TUI](https://github.com/Rigellute/spotify-tui) is spotify client
for the terminal written it rust. It provides all the features of the desktop
spotify app within the comfort of your terminal.

## Installation

There are two installation options for `Spotify TUI`. Either you install
just the TUI but in order to play music you will have to either the
desktop app running, website open, or some device connected.
Second option is to install it alongside `spotifyd` which is background
deamon that acts as a spotify connected device and allows you to
play music on you desktop/laptop without anything other running.

### Setup spotifyd

`spotifyd` is an open source Spotify client running as a UNIX daemon.
In other words, `spotifyd` is a deamon that acts as a spotify client
allowing you to play music on your device without the need of having
the spotify desktop app running or the spotify web app open.

`spotifyd` can be easily installed using `brew`: `brew install spotifyd`.[^1]

[^1]: https://spotifyd.github.io/spotifyd/installation/MacOS.html

There are some additional tweaks that need to be done on MacOS before
the deamon can run. First, make sure that you have directory for
the `spotifyd` config file:

```
mkdir -p ~/.config/spotifyd`
```

Next, create following config file modifying your username as needed:

```
echo "[global]
username = "your_username@example.com"
use_keyring = true
backend = "rodio"
" > ~/.config/spotifyd/spotifyd.conf
```

If you want to learn more about the configuration options see the full
[reference](https://spotifyd.github.io/spotifyd/config/File.html).

The configuration above takes advantage of the MacOS Keychain to store the password.
To add the password to the kaychain, run:

```
security add-generic-password -s spotifyd -D rust-keyring -a your_username@example.com -w
```

This will prompt you for the password for you spotify account. After this step
you are all set and ready. Just start up the deamon:

```
brew services start spotifyd
```

### Setup Spotify TUI

Next step is to install and configure the Spotify TUI. First install it using:

```
brew install spotify-tui
```

Next, connect it to the Spotify's API. This involves a few simple steps
that will be displayd when you first run the tui (`spt`). They go as follows:

- Go to the [Spotify dashboard](https://developer.spotify.com/dashboard/applications)
- Click `Create an app`, the name and description doesn't matter, you can for example
  use `Spotify TUI`
- Now click `Edit Settings`
- Add `http://localhost:8888/callback` to the Redirect URIs
- Scroll down and click `Save`
- You are now ready to authenticate with Spotify!
- Go back to the terminal
- Run `spt`
- Enter your `Client ID`
- Enter your `Client Secret`
- Press enter to confirm the default port (8888) or enter a custom port
- You will be redirected to an official Spotify webpage to ask you for permissions.
- After accepting the permissions, you'll be redirected to localhost. If all goes well, the redirect URL will be parsed automatically and now you're done. If the local webserver fails for some reason you'll be redirected to a blank webpage that might say something like "Connection Refused" since no server is running. Regardless, copy the URL and paste into the prompt in the terminal.

🎉 that's it, you are set and done. Now you can sit back, relax to some chill music
and watch your colleagues gaze in envy.

---

By the way, if you don't want to keep the `spotifyd` running in background you can alias `spt` to this:

```
alias spt="brew services start spotifyd && spt && brew services stop spotifyd"
```

