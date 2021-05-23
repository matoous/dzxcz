---
title: "Back up your MacOS"
date: 2021-05-23
slug: back_up_your_macos
draft: false
tags: ["macos", "writing"]
---

I lost some of my precious data and config files while migrating to new laptop
which brings me to the importance of having a backup. I did a little research on the current
options for MacOS and ended up with 3 reasonable solutions;
[Time Machine](https://support.apple.com/en-us/HT201250),
[Backblaze](https://www.backblaze.com), or
[Borg](https://www.borgbackup.org).

With my current iCloud setup, only the `Documents` and `Desktop` folders are synced
to iCloud which leaves out my `code` directory and dotfiles. I am not that worried
about the code folder as everything is versioned at GitHub and I push quite frequently,
on the other hand, loosing this directory would mean loosing around 12 GB of machine
learning datasets I accumulated either for side projects or diploma thesis.
This alone should be a big enough reason to start backing up the whole laptop,
not to mention the valuable dotfiles. For those I used [Mackup](https://github.com/lra/mackup),
tiny utility to backup and sync application settings using one of the many storage
providers (Dropbox, Google Drive, iCloud, etc.). Mackup works great, is maintained
and stable, the issue is, it doesn't understand custom config files unless you explicitly
tell it to. Which I didn't. So during the migration I lost all of my zsh configuration
files (whole `.config/zsh`), and a few, less important files such as global gitignore.
There are more flaws with Mackup from my point of view, it backs up whole application configuration
folder including log files, lock files, and temporary files making the backup bloated.
You also have to verify that indeed everything that you want it to backup is actually backed
up or you might end up like me and loose part of your configuration because you had wrong
assumptions about what will and what will not be backed up.

[Time Machine](https://support.apple.com/en-us/HT201250) can back up your MacOS device to
external hard drive, other apple device, or NAS. That's not a lot of options to choose from.
On the other hand, Time Machine comes integrated with iOS devices and will always work just
fine. In this case, the best option to me seems having a NAS at home and also backup the NAS
itself to some cloud provider to follow the [3-2-1 rule](https://www.backblaze.com/blog/the-3-2-1-backup-strategy/) of backups.

[Backblaze](https://www.backblaze.com) is a cloud back up solution priced at $60 per year.
Similarly to Time Machine it backs up your whole workstation. The backups are handled
using native software, Backblze automatically encrypts all the files and has additional
support for custom personal keys. At $60 it is significantly cheaper than buying NAS
(given the sole purpose of the NAS would be to provide storage for the Time Machine backups).
Backblaze seems like awesome solution if you want plug (read _download_) and play solution.
There are also a few similar products you might want to consider: [Arq](https://www.arqbackup.com/index.html)
priced at $49.99 a year but with limited feature set compared to Backblaze. [IDrive](https://www.idrive.com/cloud-backup)
at $52.12 a year but with limited storage size. [Carbonite](https://www.carbonite.com) priced at $83.99,
also with less features than Backblaze. And a few other options. Overall, based on the reviews
features comparison, and pricing, Backblaze seems like the best option for easy backups.

Last but not least there's [Borg](https://www.borgbackup.org) and [restic](https://restic.net).
Both CLI tools/programs that can backup to countless storage providers.
Both need to be told what to back up and where and neither runs automatically
so you would have to solve that part yourself or find an existing solution, such as
[luispabon/borg-s3-home-backup](https://github.com/luispabon/borg-s3-home-backup).
The costs are harder to calculate as they will depend on the amount of data you have,
how often you will be backing up and the storage you would like to use. Anyway,
they will be most likely lower than if you use one of the back up solution providers.

Overall, it comes up to how much effort are you willing to put into setting up the back ups
(_none_ - Backblaze or Time Machine, _a lot_ - custom solution with restic), how much
are you willing to pay (_I don't care as long as it works_ - Backblaze, _I already have a NAS at home
or want to buy one_ - Time Machine, _I am willing to backup to external hard drive_ - Time Machine,
_the least amount possible_ - custom solution with restic), and how much you value your data
(_a lot_ - whatever backup suits you, _not a lot yet_ - come back later).

