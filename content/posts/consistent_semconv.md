---
title: "Consistent Semantic Conventions for OpenTelemetry"
date: 2025-07-12
slug: consistent_semconv
draft: true
tags: ["engineering", "observability", "writing"]
---

In any organization serious about observability, OpenTelemetry (OTEL) has become the go-to standard for collecting and exporting telemetry data. But adopting OTEL alone isn’t enough. To make telemetry data meaningful and actionable—especially in a multi-team or large-scale environment—it’s essential to standardize semantic conventions.

Without consistent naming and tagging of spans, metrics, and logs, your telemetry becomes a fragmented mess. Dashboards break, queries return inconsistent results, and engineers end up guessing what a span attribute means—if they bother using it at all.

This is where Weaver comes in.
The Problem: Inconsistent Telemetry Undermines Observability

Imagine multiple teams in your company instrumenting their services using OTEL. One team uses http.method, another prefers method, and a third logs it under http.request_method. These inconsistencies multiply quickly. A shared dashboard might silently fail to include half your services, and alerts can become noisy or just miss problems entirely.

OTEL provides a set of semantic conventions—but enforcing them across your teams and services is hard. And even the official conventions often need to be extended or customized to fit your specific business context.

Weaver helps bridge this gap by allowing you to define and enforce custom semantic conventions at compile time.


## Learn more

If you want to learn more, you might want to listen to Dinesh Gurumurthy's (Datadog Inc.) talk from SREcon25:

<iframe width="560" height="315" src="https://www.youtube-nocookie.com/embed/Vd6MheRkHss?si=ZV6uJSflBmGUqpxh" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
