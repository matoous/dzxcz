---
title: "Localization in a few lines of code"
date: 2020-11-09
slug: localization
draft: true
tags: ["code", "web", "writing"]
---

{{<cite "[Wikipedia](https://en.wikipedia.org/wiki/Internationalization_and_localization)">}}
In computing, internationalization and localization are meansof adapting computer software to different languages,
regional peculiarities and technical requirements of a target locale.
{{</cite>}}

```js
const lang = (navigator.languages && navigator.languages.length && navigator.languages[0]) || navigator.language || 'en';
const timeFormatLong = new Intl.DateTimeFormat(lang, { year: 'numeric', month: 'long', day: 'numeric' });
const timeFormat = new Intl.DateTimeFormat(lang, { year: 'numeric', month: '2-digit', day: '2-digit' });
// localize long datetime in article info
document.querySelectorAll("article time").forEach(t => {
    t.innerHTML = timeFormatLong.format(new Date(t.getAttribute("datetime")))
})
// localize short datetime in listings
document.querySelectorAll(".listing time").forEach(t => {
    t.innerHTML = timeFormat.format(new Date(t.getAttribute("datetime")))
})
```
