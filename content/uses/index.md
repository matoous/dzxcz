---
title: "Gear"
layout: "etc"
---

## Software

### Terminal

[Ghostty](https://ghostty.org/) is my current terminal of choice. I went through [Hyper](https://hyper.is/), [iTerm2](https://iterm2.com/), [Kitty](https://sw.kovidgoyal.net/kitty/), and [Wezterm](https://wezfurlong.org/wezterm/) before. Each time sacrificing bit of the features (that I didn't use anyway) in favor of speed. Kitty, Wezterm, and Ghostty both seem on par in performance and I don't have strong preference for one versus the others. At the moment, it's Ghostty, in the future, I might go back to one of the others.

One underestimated factor of programming comfort are fonts. Good fonts strike the right balance of legibility, glyphs, and line-height. I have been using [Berkeley Mono Typeface](https://berkeleygraphics.com/typefaces/berkeley-mono/) since its release, initially doubting whether paying for a font is a justifiable endeavor but it brings me tiny bit of joy whenever I open my terminal ever since.

### Shell

I run [Fish](https://fishshell.com/) shell nowadays, it used to be [Zsh](https://www.zsh.org/) and [Oh My Zsh](https://ohmyz.sh/) prior to that. The only plugin that I use is [fzf.fish](https://github.com/PatrickF1/fzf.fish) for history search. For prompt, I use minimal configuration of [Starship](https://starship.rs/) prompt (directory and git information).

### Editor

{{<picture src="images/terminal.png" alt="Screenshot of my editor - Helix." caption="Screenshot of my editor as of the writing of this page." >}}

[Helix](https://github.com/helix-editor/helix) for almost everything, sometimes I spin up [VS Code](https://code.visualstudio.com/) for a specific task. Last I remember it was for a multiline search and replace across a whole project (I couldn't wrap my head around [ast-grep](https://github.com/ast-grep/ast-grep) at that time but got better hand of it since).

In university we had free licenses for [JetBrain](https://www.jetbrains.com/) products and I used those when I started programming. For editing in terminal I would use [Nano](https://help.ubuntu.com/community/Nano) and avoid it like the plague. As I needed to edit more and more configuration files and sometimes work remotely I decided to learn working with Vim in February 2021. The learning curve is indeed steep but there's certain level of satisfaction in taming the beast. Around that time [LSP](https://microsoft.github.io/language-server-protocol/) and [Tree-Sitter](https://tree-sitter.github.io/tree-sitter/) were becoming the norm, enabling the full IDE experience in Vim at a cost of 600 lines long configuration file.

As with other tools, I started looking into simplifying the setup. I ditched a few plugins, removed all unnecessary configuration, and downsized by Neovim config file to half. That is, until I found Helix.

[Helix](https://github.com/helix-editor/helix) provides similar experience to Vim with one major twist. While in Vim you start with `action` followed by `motion` (e.g. `d3w` to **d**elete 3 **w**ords) Helix follows `selection` -> `action` paradigm inspired by [Kakoune](https://github.com/mawww/kakoune) (if you never header of it, don't worry, I did neither until reading more about Helix). It's striking difference from Vim that takes time to get used to but comes naturally afterward. Second large difference is first-class support for multi-cursor. Where in Vim you would substitute using the `%s/SEARCH/REPLACE/g` command in Helix you select the text (e.g. `%` for whole file), select the pattern in the selection (e.g. `s` followed by the term you are searching for), by confirming the selection you create multiple individual cursor, and you can edit them all at once.

Nothing can be perfect though, development of Helix is moving at a slow pace with features such as plugin support taking years to make it into upstream. On the other hand, the slowness reduces feature creep and contributes to a clean codebase.

At the moment I am using the [Modus Vivendi](https://protesilaos.com/emacs/modus-themes). A accessible theme, conforming with the highest standard for color contrast between background and foreground values (WCAG AAA) theme by [Protesilaos Stavrou](https://protesilaos.com/) originally built for GNU Emacs.

### Browser

After full circle, going from [Firefox](https://www.mozilla.org/en-US/firefox/new/) to [Safari](https://www.apple.com/safari/) and later to [Arc](https://arc.net/) I am back at the beginning using Firefox as my primary desktop browser. There's not much to it other than _it works_ and it doesn't get into my way.

### Raycast

[Raycast](https://www.raycast.com/) launcher is one of my essentials. I started with [Alfred](https://www.alfredapp.com/) but didn't like its UI and the way of writing extensions. It replaced a lot of other apps I previously depended on. Right now, it's free for personal use which I expect to change at one point in the future but I am willing to pay for it. My only hope is that their model won't be subscription based.

### iA Writer

For writing posts for this blog and managing [wiki.dzx.cz](https://wiki.dzx.cz) I use [iA Writer](https://ia.net/writer). It's an exceptionally well built writing software that helps me write. Built-in syntax highlight and style checking means one can focus on the content and iA Writer takes care of typos, common clichés, or redundancies. 

### Tools

- [ag](https://github.com/ggreer/the_silver_searcher) for code search
- [amber](https://github.com/dalance/amber) for search and replace
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
- [ouch](https://github.com/ouch-org/ouch) for painless compression and decompression in the terminal

### Apps

- [1Password](https://1password.com/) for passwords management
- [balenaEtcher](https://www.balena.io/etcher/) for flashing OS images to SD crds & USB driver
- [boop](https://github.com/IvanMathy/Boop) tool for text wrangling and small utilities
- [devtoys](https://devtoys.app/) various developer tools for converting formats, images, and much more. Currently testing as a replacement for `boop`.
- [IINA](https://github.com/iina/iina) for videos
- [Insomnia](https://github.com/Kong/insomnia) - API client
- [Itsycal](https://github.com/sfsam/Itsycal) - tiny calendar for menu bar
- [Amphetamine](https://apps.apple.com/us/app/amphetamine/id937984704?mt=12) for preventing the MacOS from sleeping
- [Ice](https://github.com/jordanbaird/Ice) - a menu bar manager for MacOS to keep it nice and tidy.

## Mac Setup

- [configure TouchID for sudo](https://apple.stackexchange.com/a/306324)
- [optimize for speed](https://github.com/koding88/MacBook-Optimization-Script)

### Other

- *Wallpapers*: [OS9 Walppapers](https://www.arun.is/blog/os9-wallpaper/) by [Arun](https://www.arun.is/)

## Hardware

- [Apple MacBook Pro](https://www.apple.com/macbook-pro-13/)

- [iPhone 13 mini](https://www.apple.com/iphone-13/). I was split on whether to buy 13 or 13 mini when my trusty iPhone 7 stopped working. After some back and forth the decision was made to opt for the smaller model. It's a phone and does the things that all other phones do. It stays charged throughout the day (the previous one didn't), takes great pictures (the limit is currently my artistic sense, not the phone), can navigate me wherever I need.

- [AirPods 3rd generation](https://www.apple.com/airpods-3rd-generation/). For a long time I refrained from buying expensive-_ish_ wireless headphones. I loved the basic Apple airpods that used to be inlcuded in the box. When I broke the last ones that I got with my [iphone 7]() I switched to cheap [Seinheisser XXX](), the reasonale being that I will eventually leave them in a pocket of my running shorts and wash them. Those were only for sports and at work I used their bigger sibling [](). Eventually, when iPods 3 came out, I decided to give them a shot to see how they compare to their wired predecessors that I held so dear and it was a great decision. I can't be bothered by wires again, ever. The sounds quality is stellar compared to what I had before and the Airpods already survived a few beatings (dropped them second week after purchase on a bike at 40 km/h) which is another big plus. For me they strike nice balance between simplicity, sound quality, and price and I most likely won't be migrating to anything else anytime soon.

### Keyboard

Typing on [HHKB Pro Hybrid](https://hhkeyboard.us/hhkb/pro-hybrid) since 2025. The price tag made me reluctant to press the "Order" button but hey, I spend good part of the day programming or writing documents, and good keyboard brings me a joy. I was also afraid of the different layout (no `fn` key and `ctrl` in place of `caps lock`) but it took a day to get used to and in the end feels like significant ergonomics gain. Furthermore, HHKB uses [Topre](https://hhkeyboard.us/blog/topre-switches) switches, unparalleled by any other keyboard I have had before.

## Everyday

### The Bag

Currently I use [Thule Aion 40l](https://www.thule.com/luggage/carry-on-luggage/thule-aion-travel-backpack-40l-_-3204724)
as my every day carry. It's big, sturdy, ideal when you want to bring clothes and shoes to go for a run after work and
still buy the groceries on your way home. 40l initially seemed like an excesive volume for an every-day
back pack but now I would hardly go for anything smaller.

Previously I used [The Backpack Pro](https://eu.dbjourney.com/collections/backpacks/products/the-backpack-pro) by Db
which wasn't bad but I had my complains. Thule was definitely an improvement although the number of internal compartements
seems to be excessive in comparison to Db. On the other hand, the main pocket doesn't open on it's own when heavily loaded.

### Everyday carry

- [_Book_]({{< ref "/books" >}}). I Always carry at least one around[^books], most of the time non-fiction books about
  software engineering, economics, statistics, or thinking. Sometimes I also read fiction but I tend to get very excited
  and hooked by the plot and the books don't spend more than 3 days in my bag.
- [Tech Kit](https://bellroy.com/products/tech-kit/looma_viroblock_standard/basalt) by [Bellroy](https://bellroy.com/).
  I would consider this an unnecessary luxury but it works fine and I hope it will last for a long time. As a bonus, it also looks good.
- [TriggerPoint](https://www.tptherapy.com/) [MBX](https://www.tptherapy.com/massage-balls/mbx-massage-ball.html)
  and [MobiPoint](https://www.tptherapy.com/massage-balls/mobipoint-massage-ball.html) massage balls. Perfect small companions
  for recovery. Sometimes I use the MobiPoint to massage my feet even at work, and when needed, it can be used to apply pressure
  to verious stiff areas. Works like a charm.
- Microfiber cloth to clean my glasses.
- Screen wipes to clean my laptop screen.
- [Humangear](https://www.humangear.com/) spork in case I bring a food with me that can't be eaten using the hand.
  In full honestly, all I really need is a spoon but I couln't find a nice travel spoon so spork it is.
- [Nalgene](https://nalgene.com/) 1l bottle to keep hydratated.
- [Landgarten Chocolate Fruits](https://www.landgarten.at/en/product-category/schoko-naschfruechte/)
  bio organic chocolate + fruite snack. I like raspberry and ginger the most. Also, the packages are quite
  small so it never happens that you eat too much.
- [100% Konnor](https://100percent.eu/collections/konnor) sunglasses. I wear perscription glasses most the time
  and when deciding between seeing well versus being shileded from sun I opt for the former rather than later.
  Maybe one day I will get into the habit of using contact lenses also when not doing sports and the sunglasses
  will come in handy.
- [Curaprox Travel Set](http://www.curaproxclub.cz/produkty/curaprox-travel-set-308/) in case I ever forget my hygiene kit or get stuck with just my bag.
  The _forgot_ part happens more frequently than I would like to admit.
  I haven't used the kit yet, which just confirms the rule of _it won't happen if you are prepared_.[^preparedness_paradox]
- [Moleskin Hard Cover A4 notebook](https://www.moleskine.com/en-us/shop/notebooks/the-original/classic-notebook-black-8053853602848.html)
- [Aesop Resurrection Aromatique Hand Balm](https://www.aesop.com/de/en/p/body-hand/hand/resurrection-aromatique-hand-balm/)
- [Fisherman's Friend](https://fishermansfriend.com/en) mints for fresh breath. Most of the time the Raspberry flavour.

[^preparedness_paradox]: [Preparedness Paradox](https://en.wikipedia.org/wiki/Preparedness_paradox)
[^books]: My friends will know that _at least one_ usually means around 5 with the completely invalid argument behind it being "In case I finished one, I want to have a backup". On the other hand, my bag is sufficiently large to fit them all, it's only manifesting on the weight of it.


## Sports

Some notes after a few years of doing quite a few sports:

- When switching shoes (doesn't matter if running or cycling), don't go all in but alternate with your
  old shoes for at least first 2 weeks. Took me one heel inflammation and one knee inflammation to learn my lesson.
- Sadly, price correlates with quality and good gear costs money. Ideally have friends that work in the industry
  and can get you discounts or tips at least (easier said than done).
- If something works for you (e.g. certain brand of shoes fits you well) there's no reason to experiment, usually that
  ends with more harm than good.

### Running

I tend to keep running shoes for 600km - 1000km depending on their condition.

**Clothing**:

- [Soar Run Trousers](https://global.soarrunning.com/collections/cold-weather/products/mens-run-trouser-black), merino wool-lined trousers for cold weather.
- [Lululemon Surge Lined Short](https://shop.lululemon.com/p/men-shorts/Surge-Short-Liner-6), shorts for any other weather.
- [Ciele M RCDTShirt – Elite](https://cieleathletics.com/eu/product/m-rcdtshirt-elite-ghost/), race t-shirt.
- [Ciele M DBSShort – Elite](https://cieleathletics.com/eu/product/m-dbsshort-elite-shadowcast/), race shorts for races up to the marathon distance.

**Shoes**:

- [Saucony Endorphin Speed 3](https://www.saucony.com/en/endorphin-speed-3/52956M.html).
- [On Running Cloudultra](https://www.on-running.com/en-us/products/cloudultra-fluorite), favourite.
- [Salomon S/LAB Ultra 3](https://www.salomon.com/en-gb/shop-emea/product/s-lab-ultra-3.html), favourite.

{{<details "Retired">}}
- [On Running Cloudflow](https://www.on-running.com/en-us/products/cloudflow)
- [Saucony Triumph 18](https://www.saucony.com/en/triumph-18/44577M.html)
- [Mizuno Wave Rider 25](https://emea.mizuno.com/eu/en/wave-rider-25/J1GC210301.html)
- [Saucony Kinvara 12](https://www.saucony.com/en/kinvara-12/48024M.html), favourite
- [Saucony Endorphin Pro 2](https://www.saucony.com/en/endorphin-pro-2/50611M.html), favourite
- [Nike Zoom Fly 3](https://www.nike.com/running/zoom-fly), good shoe but narrow toe box and it lost the springiness really fast)
{{</details>}}

## Clothing

I am slowly iterating towards have a few brands that have consistently good products that I like. In general I aim for brands with good reputation[^patagonia] [^asket] even if that means paying premium. My woredrobe consistent mostly of plain, logo-less clothing

### T-shirts

All plain in tame colors, from [Asket](https://www.asket.com/us), [Zagh](https://myzagh.cz/en) (a Czech brand), [Pangaia](https://eu.pangaia.com/), and ocassionally [Zara](https://www.zara.com/). Recently I am a fan of the oversized and skater fit.

### Pants

All my pants at the moment are from [Lululemon](https://shop.lululemon.com/) and specifically two of their models, the _ABC Slim-Fit Pant_ and _Commission Slim-Fit Pant_. I wear size 32" and they are the best fit I have found so far. Event he slim-fit cut fits well for figures with larger quads and don't restrict the movement. I have different colors on rotation and for the hot some weather wear the WovenAir version with perforated fabric.

[^patagonia]: [Patagonia founder just donated the entire company, worth $3 billion, to fight climate change](https://www.cnbc.com/2022/09/14/patagonia-founder-donates-entire-company-to-fight-climate-change.html)
[^asket]: [Asket - Transparency](https://www.asket.com/us/transparency)
