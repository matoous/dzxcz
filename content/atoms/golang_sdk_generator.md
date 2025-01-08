---
title: Golang SDK generator
date: 2025-01-08
---

Tiny, work-related, long overdue project is finally shaping up - SumUp finally has a working [Go SDK](https://github.com/sumup/sumup-go).

There's surprising void of a solid OpenAPI tooling for Go, [oapi-codegen](https://github.com/deepmap/oapi-codegen) being the go-to best option yet somehow unfit for SDKs. oapi-codegen focuses on supporting everything one might describe in OpenAPI specs at the cost of ergonomic and structured code that requires opinionated approach. And given SDKs are becoming the norm of a first-class developer tooling, we decided to roll with our own generator. For now, you can check the generated code in [sumup-go](https://github.com/sumup/sumup-go) but I hope we can open source our tool within the following month, giving a little back to the open source community that we are taking plenty from.

