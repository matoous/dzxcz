---
title: "Show, don't tell"
date: 2023-02-11
slug: show_dont_tell
draft: false
tags: ["engineering","writing"]
---

[Show, don't tell](https://en.wikipedia.org/wiki/Show,_don%27t_tell) is a writting technique that
allows the reader to experience and relate to the story through actions and feelings rather than
exposition. The _show, don't tell_ rule applies to all kinds of written text from poetry to
screenwriting. Can the rule be extended to engineering documents as well?

Presentations are the first place where the _Show, don't tell_ rule works well.
Nothing gets the audience bored more than a wall of text on every slide.
In the case of presentations _show, don't tell_ applies to both the content of slides
and the presenters speach. Tell or show the listeners the story (e.g. "Our users are having issues
using our product in such and such way") and let them figure out the rest. Here's
a wonderful example from my colleague Johanneses recent presentation
for the _Incident of the month_.

{{< picture src="pres1.png" alt="Example presentation slide number 1." >}}
{{< picture src="pres2.png" alt="Example presentation slide number 2." >}}

Another place where the _Show, don't tell_ rule can help you is in RFCs and architecture
documents. Explaining relationships, models, flows, or service dependencies is hard
and often neglected by the person writing the document because they might already have the necessary
context to build the mental model. The easier way to get everyone on the same page
is to provide visual guidence. Here's an example from our RFC on the introduction
of External Authorization API showing the flow between an user and our services.

{{< picture src="traffic.png" alt="Example flow chart from RFC." >}}

Following the _Show, don't tell_ rule requires more effort but there are several benefits to it:

* Most people are visual learners and can extract information better from images than walls of text.[^1]
* Drawing or mapping down problems and solutions helps also you - the author - align your thoughts.
* Visual explanation often reduces the ambiguity of written text.

In short, tell the audience the story or issue and let them draw conclusions from there without
forcing your narrative. This brings wider range of opinions into discussion and makes the others
more interested. And when applicable, provide visual material alongside the text to help the readers
understand the models or flows so that you can focus on the important things instead of explaining
ambiguities in your writing.

[^1]: https://papers.ssrn.com/sol3/papers.cfm?abstract_id=587201
