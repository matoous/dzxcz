---
title: "November"
date: 2024-12-01
slug: november_2024
draft: true
tags: ["journal","writing"]
---

## Reading

[The ultra-selfish gene](https://www.worksinprogress.news/p/the-ultra-selfish-gene) by Mathias Kirk Bonde in the [Work in Progress](https://www.worksinprogress.news) news.

[All you need is Wide Events, not “Metrics, Logs and Traces”](https://isburmistrov.substack.com/p/all-you-need-is-wide-events-not-metrics) by [Ivan Burmistrov](https://substack.com/@isburmistrov) reminded me of [Canonical Log Lines 2.0](https://brandur.org/nanoglyphs/025-logs) by [Brandur](https://brandur.org). At SumUp we heavily rely on [Open Telemetry](https://opentelemetry.io/) but articles such as the above make me want to try and experiment with different approaches. One common painpoint we observe with many teams is the usage of logs. In many cases teams leave everything on _info_ level even in production which results in verbose logs that don't provide enough useful information to justify their existence and often run into the risk of leaking sensitive data. Furthermore, navigating between different signals (logs, traces, and metrics) is hard unless your company has a strong and enforced guidelines for common attributes (not our case unfortunately).[^scuba]

[Wind the clock](https://www.citationneeded.news/wind-the-clock/) by [Molly White](https://www.citationneeded.news)
[The 2024 U.S. Election is Over. EFF is Ready for What's Next.](https://www.eff.org/deeplinks/2024/11/2024-us-election-over-eff-ready-whats-next) by [Electronic Frontier Foundation](https://www.eff.org)

[^scuba]: For further reading, [Scuba: Diving into Data at Facebook](https://research.facebook.com/publications/scuba-diving-into-data-at-facebook/) is a longer technical dive into the observability infrastructure at Meta.
