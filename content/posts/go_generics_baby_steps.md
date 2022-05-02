---
title: "Go generics: Baby steps"
date: 2022-04-03
slug: go_generics_baby_steps
draft: false
tags: ["code","golang","writing"]
---

Generics have come to Go. One of the most radical changes to Go in years
that sparkled a lot of heated discussions and took the frontpage of HN many times.
The time has finally come to give it a try.

## Generics

Go is a _typed_ language, meaning that every value, variable, and function has a specific
type (such as `int` or `func (string) error`). Until go 1.18 the only way to get around the type
restrictions was to either use `interface` or generate typed code before compiling the binary.
Since Go 1.18 there's also third option, _generics_. Let's take a look at a little example
that we use extensively throughout our codebase.


```go
package pointerx

func To[V any](v V) *V {
	return &v
}

func From[V any](v *V) V {
	if v == nil {
		var res V
		return res
	}
	return *v
}
```

This is a small convenient utility that helps converting _from_ and to _pointers_. Previously,
our implementation would have many of those function different only in the type that they
take and return. For example `String(string) *string` to convert from string to pointer.
We had to define one such function for each and every type that we wanted to convert to and from pointer.

With generics, this gets fairly easy and can be written in 10 lines of code. And it will work for _any_
type that we might want to throw at it.

## When to use generics

You most likely won't need generics 99% of the time. There are only two large use cases where you should
consider introducing generics: general purpose data structures (such as linked list, B-Trees, or hash maps - already part of language)
and functions that work over language-definied container types (`map`, `slice`, `channel`).

## Wrap Up

I am still very careful with introducing any generics into our codebase mostly because I believe that
they are not needed in most of the cases and the potential for misuse often overweights the benefits.
Here though, I must say I am glad that generics were introduced to Go as they make for nice and lean code.

