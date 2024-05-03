---
title: CRDTs
date: 2024-02-17
---

In a recent side-project attempt to built an RFC management tool I ventured into the topic of [CRDTs](https://en.wikipedia.org/wiki/Conflict-free_replicated_data_type) (Conflict-free Replicated Data Type) and web-based text editors. Here is a loose collection of links to various tools and articles on the topic:

- [An Interactive Intro to CRDTs](https://jakelazaroff.com/words/an-interactive-intro-to-crdts/)
- [Collaborative Editing in ProseMirror](https://marijnhaverbeke.nl/blog/collaborative-editing.html)
- [CRDTs Turned Inside Out](https://interjectedfuture.com/crdts-turned-inside-out/)
- [Ink and Switch](https://www.inkandswitch.com) - Articles on collaborative peer-to-peer editing.
- [A Gentle Introduction to CRDTs (Conflict Free Replicated Data types (CRDTs))](https://vlcn.io/blog/gentle-intro-to-crdts.html)

Implementation

- [cola: a text CRDT for real-time collaborative editing](https://nomad.foo/blog/cola) - leightweight CRDT implemention in rust for plain text documents.
- [Loro](https://github.com/loro-dev/loro) - feature-rich CRDT implemention for rich-text documents in rust.
- [y-crdt](https://github.com/y-crdt)

Editors

- [CodeMirror](https://codemirror.net/)
- [ProseMirror](https://prosemirror.net/)
- [Quill](https://quilljs.com)
