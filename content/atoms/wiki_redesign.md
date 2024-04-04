---
title: Wiki redesign
date: 2024-04-03
---

The [Wiki](https://wiki.dzx.cz/) now has a new fresh look. I migrated the whole website to a custom framework - [mwp](https://github.com/matoous/mwp) - to be able to customize it as much as I please. `mwp` is built in [Rust](https://www.rust-lang.org/) on top of [actix](https://actix.rs/) (web framework), [maud](https://maud.lambda.xyz/) (macro for writing HTML), and [tantivy](https://github.com/quickwit-oss/tantivy/) (search). The whole server is then packaged into a docker container and deployed on [fly.io](https://fly.io/).

The main goal of the rewrite was to add a search functionality that would allow me (and anyone else) to search for all links in the Wiki in a way that takes into consideration the content of the linked websites as well. That's done by scraping the links, putting the content into an sqlite database that lives alongside the repository, and indexing everything using [tantivy](https://github.com/quickwit-oss/tantivy/) at startup. There's still plenty of room for improvement; at the moment the scraping still needs to be triggered manually and while the index building is fast, it unnecessarily delays the application startup which is especially annoying during local development.
