---
title: "Localization in a few lines of code"
date: 2021-05-13
slug: localization_in_a_few_lines_of_code
draft: false
tags: ["code", "web", "writing"]
---

{{<cite "[Wikipedia](https://en.wikipedia.org/wiki/Internationalization_and_localization)">}}
In computing, internationalization and localization are means of adapting computer software to different languages,
regional peculiarities and technical requirements of a target locale.
{{</cite>}}

{{<cite "[XKCD #1179](https://xkcd.com/1179/) by Randall Munroe" noQuotes>}}
[![relevant xkcd](xkcd.png)](https://xkcd.com/1179/)
{{</cite>}}

This is a tiny script that I initially used on [this blog](https://dzx.cz) to localize dates.
Shortly after I realized that it is really unnecessary as there's only a
[single correct date format](https://en.wikipedia.org/wiki/ISO_8601).
Anyway, your idea of the perfect date might be _wrong_ so here's the code:

```js
const lang =(navigator.languages && navigator.languages.length && navigator.languages[0]) || navigator.language || 'en';
const timeFormat = new Intl.DateTimeFormat(lang, { year: 'numeric', month: '2-digit', day: '2-digit' });
document.querySelectorAll("time").forEach(t => {
    t.innerHTML = timeFormat.format(new Date(t.getAttribute("datetime")))
})
```

