---
title: "November"
date: 2024-12-01
slug: november_2024
draft: true
tags: ["journal","writing"]
---

## Reading

[All you need is Wide Events, not “Metrics, Logs and Traces”](https://isburmistrov.substack.com/p/all-you-need-is-wide-events-not-metrics) by [Ivan Burmistrov](https://substack.com/@isburmistrov) reminded me of [Canonical Log Lines 2.0](https://brandur.org/nanoglyphs/025-logs) by [Brandur](https://brandur.org). At SumUp we heavily rely on [Open Telemetry](https://opentelemetry.io/) but articles such as the above make me want to try and experiment with different approaches. One common painpoint we observe with many teams is the usage of logs. In many cases teams leave everything on _info_ level even in production which results in verbose logs that don't provide enough useful information to justify their existence and often run into the risk of leaking sensitive data. Furthermore, navigating between different signals (logs, traces, and metrics) is hard unless your company has a strong and enforced guidelines for common attributes (not our case unfortunately).[^scuba]

The [2024 United States presidential election](https://en.wikipedia.org/wiki/2024_United_States_presidential_election) is over and people in my little online bubble had a lot to say (rightfully so). [Molly White's](https://www.citationneeded.news) [_Wind the clock_](https://www.citationneeded.news/wind-the-clock/) rejects the defeatism and focuses on action anyone can take to fight for the press freedom, access to information, and migrant and reproductive rights. In the same vein, [Electronic Frontier Foundation](https://www.eff.org) pledged "to ensure that technology serves you—rather than silencing, tracking, or oppressing you—does not change" in their [_The 2024 U.S. Election is Over. EFF is Ready for What's Next._](https://www.eff.org/deeplinks/2024/11/2024-us-election-over-eff-ready-whats-next). Another read-worthy posts include [America, the final season](https://www.garbageday.email/p/america-the-final-season) and [Pluralistic: Antiusurpation and the road to disenshittification](https://pluralistic.net/2024/11/07/usurpers-helpmeets/).

Observing, even from the safe haven of Europe, one can't help but feel sad about the lost values, progress thrown away, and the degradation of baseline of what strong leaders should be. David Brooks's [_The Road to Character_]({{< ref "/books/the_road_to_character" >}}) talks about selfless heroes in our history and I wish USA gets back to having their president worth the list.

(wip) [The ultra-selfish gene](https://www.worksinprogress.news/p/the-ultra-selfish-gene) by Mathias Kirk Bonde in the [Work in Progress](https://www.worksinprogress.news) news.

## Listening

[Viktor Sheen](https://viktorsheen.cz/) released new album titled _Impostor syndrom_; as always, the songs are hit or miss with _hits_ frequently ranking in the top 3 of my Spotify yearly recap.

<iframe style="border-radius:12px" src="https://open.spotify.com/embed/track/6gj6FXx7jZXOOdLX4aNaSK?utm_source=generator&theme=0" width="100%" height="152" frameBorder="0" allowfullscreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>

## Watching

The 8th longest flight in the world from Auckland to Dubai provides just enough time (17 hours and 25 minutes to be exact) to rewatch the [Lord of the Rings](https://en.wikipedia.org/wiki/The_Lord_of_the_Rings_(film_series)) trilogy in extended edition. Unfortunatelly, Emirate's onboard entertainment had only the theatrical release which had to do. Next month I am flying to Brazil (12 hours to São Paulo) which leaves me with the only other thing on _worth re-watching_ list - [Band of Brothers](https://en.wikipedia.org/wiki/Band_of_Brothers_(miniseries)).

[^scuba]: For further reading, [Scuba: Diving into Data at Facebook](https://research.facebook.com/publications/scuba-diving-into-data-at-facebook/) is a longer technical dive into the observability infrastructure at Meta.
