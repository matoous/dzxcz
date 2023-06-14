---
title: "May"
date: 2023-06-01
slug: may_2023
draft: false
tags: ["journal","writing"]
---

Our (SumUp) API documentation and [developer portal](https://developer.sumup.com/) is subpar and unfortunatelly not getting a too much attention. Last hackweek, at this ponit almost year ago, we reworked the portal using [Docusaurus](https://docusaurus.io/) and [Docusaurus OpenAPI Doc Generator](https://github.com/PaloAltoNetworks/docusaurus-openapi-docs). Now I am spending time on Developer portal 2.0, this time built on top of [Astro](https://astro.build/) with custom OpenAPI rendering. It's an entertaining sideproject. Rendering OpenAPI specs doesn't seem that hard (as long as your OpenAPI specs are in a good shape, which for us isn't exactly the case). Furthermore, I testing out ChatGPT for rewriting React components into Astro and it is working pretty well. Rewriting  and updating existing code seems to be a task well suited for it.

While we are taking out the dirty laundry, another broken thing at SumUp is the RFC process. Although, I am not sure if something that's absent can be broken. We set to fix this by creating an RFC process and working group inspired by [The Power of “Yes, if”: Iterating on our RFC Process](https://engineering.squarespace.com/blog/2019/the-power-of-yes-if) and Oxide's [RFD 1 Requests for Discussion](https://oxide.computer/blog/rfd-1-requests-for-discussion/). If there's an initiative that I would love to succeed it's this one. RFCs for cross-tribe and cross-team agreement in an organisation of 700 engineers are a must and we are suffering greatly from not having a process.[^1]

## Reading

- [Contrafreeloading](https://mikefisher.substack.com/p/contrafreeloading)

  > The three grand essentials of happiness are: Something to do, someone to love, and something to hope for.

- [Lean = fast](https://brandur.org/fragments/lean-fast) from Brandur on speed of delivery, the power of small teams, uniform tech stack, and services of reasonable size.
- [Animated Drawings](https://fairanimateddrawings.com/site/home), implementation of the algorithm described in the paper 'A Method for Automatically Animating Children's Drawings of the Human Figure'.

## This month I learned


## Watching


## Listening


[^1]: There are other great resources concerning this topic such as [Scaling Engineering Teams via RFCs: Writing Things Down](https://blog.pragmaticengineer.com/scaling-engineering-teams-via-writing-things-down-rfcs/) by _Gergely Orosz_.
