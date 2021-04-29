---
title: "March"
date: 2021-04-01
slug: march_2021
draft: false
tags: ["journal","writing"]
---

This month I did something I should have done a long time ago. I started learning
[Kubernetes](https://github.com/tpope/vim-surround). I already read a little bit about
the internals and spend a lot of time reading documentation for [Nomad](https://github.com/hashicorp/nomad)
by Hashicorp, younger, simpler sibling of kubernetes. Kubernetes is a whole another
level of monster though.

I will be leaving
my current job at [Kiwi.com](https://kiwi.com) and joining [SumUp](https://sumup.com/)
in June. Most likely remotely at the beginning but I plan to move to Berlin as soon
as the situation permits. This was a huge decision and not an easy one to make.
I like Kiwi.com, the team, the people, the job. The thing is, there most likely won't
be a better time than now and this is an opportunity I would be a fool not to take.

### Mallorca

Not very often, especially in these times, you get the opportunity to set foot
(or a wheel) abroad. So when I was approached by a friend with the offer of
flying to Mallorca for 10 day cycling trip I accepted it without much hesitation.
To be honest, I was quite nervous because my road cycling experience until than
consisted of around 400km in 3 months. It didn't help much either that I would
be in a company of experienced riders with track record of years with over 10,000km
and multiple wins on Czech as well as foreign races.

It goes without saying that the trip was intensive and demanding but to my surprise
my legs held quite well. In the 10 days on the scenic island of Mallorca we rode
1097.86 km with average speed well above 30 km/h and grand total of 12,171
vertical meters. I saw the most remarkable sights such as Formentor and the bay
of Sa Calobra (this one still hurts).

Overall, and in simple terms, I loved it. In a company of great people the
suffer fest turned into one of the best vacation I ever had and I hope
there will be more in the future.

{{<rawhtml>}}
<iframe height='405' width='590' frameborder='0' allowtransparency='true' scrolling='no' src='https://www.strava.com/activities/5020520378/embed/59e575935634d96cfc9dc781ff90b4cd5c0e13e0'></iframe>
{{</rawhtml>}}

### The act of note taking

[Robin Cussol](https://www.robincussol.com/), colleague of mine, has this well written
and highly informative [blog](https://www.robincussol.com/).
In his 2020 year review he mentions a habit that I wanted to implement
for quite some time: _note taking_.

In the online world we are surrounded with vast amount of information on
all the possible subjects. News, social media, pictures, even videos are all
build to be consumed in great quantities, fast, and without many thoughts.
Yet, we prosper the most by diving deep into the things that we enjoy or
that we want to learn.

Taking notes forces you to slow down. To better consider what you spent
your time on. And for me most importantly there's actually something
left behind instead of me forgetting everything in matter of hours.
Partially, I take my notes here, on this blog. Either in the form
of book wrap-ups and reviews or in the form of short blog posts and
monthly look-backs. I also have plenty of stuff written in [Notion](https://www.notion.so/)
where I did a large cleanup recently and decided to delete as many
links as possible. Instead, I tried to write short TL;DR of what I learned
from the article and I plan to keep this approach further.
Would be nice to do the same thing with the hundreds of opened
tabs in my mobile web browser but that will take a few days
so maybe another time.

### Reading

* [Clean Architecture with GO](https://manakuro.medium.com/clean-architecture-with-go-bce409427d31).
  Even as my knowledge of Golang ecosystem grows, I am yet to find out, what the best application structure
  is for clean and maintainable APIs. For example the [MVC](https://en.wikipedia.org/wiki/Model%E2%80%93view%E2%80%93controller)
  pattern isn't really applicable in Golang, rather structures similar to `api <-> service <-> storage`
  can be often seen, but those sometimes fall short of the needs as well. This article
  provides a nice take on alternative approach with schema `controller -> interactor -> presenter`
  where `controller` encapsulates the request logic, `interactor` handles the internal
  stuff you would normally find in the `service` and `storage` layer and `presenter`
  handles the transformation of the application models back into response returned
  to the user.
* [The Pirate Problem](https://alexdanco.com/2021/02/02/the-pirate-problem/), what could
  be hard about five pirates dividing a treasure.
* [Nomad](https://github.com/hashicorp/nomad/) is workload orchestrator developed
  by [Hashicorp](https://learn.hashicorp.com/). It's wonderful piece of software
  that I started to dig into to better understand internal working of workload
  orchestrators and schedulers (think kubernetes).
* [r/WhiteHouseBets](https://alexdanco.com/2021/01/28/r-whitehousebets/) by Alex Danco,
  on GME, Reddit, reflexivity, and how internet enables crowds of people to focus their
  attention onto singular thing.
* [A Sea Story](https://www.theatlantic.com/magazine/archive/2004/05/a-sea-story/302940/)
  by William Langewiesche. After quite some time I found myself on an airport quickly
  looking for some read into the airplane. And where else to look for than in the
  archives of William Langewiesche's. This time, another disaster horror story from
  1994 when 850 people lost their lives on board luxurious ferry on the Baltic sea.
* [Tracing Paper](https://logicmag.io/security/tracing-paper/) by Mitch Anzuoni.
  That your digital footprint is easily trackable is now a fact almost taken for granted
  but who would have assumed that printed documents could be tracked too?
* [Inside a viral website](https://notfunatparties.substack.com/p/inside-a-viral-website) by Tom.
  Ever Given container ship blocked the Suez canal for just over 6 days which had not
  only impact on large portion of the world's trade but also the world's meme scene.
  One of the greatest memes being [istheshipstillstuck.com](http://istheshipstillstuck.com).
  This article talks about running the viral meme website that attracted large amount
  of traffic of the course of the 6 days and goes into details of how the author tried
  to monetize it.

### Watching

* [Authentication as a Microservice](https://www.youtube.com/watch?v=SLc3cTlypwM),
  [Brian Pontarelli](https://twitter.com/bpontarelli)'s take on [Jason Web Tokens](https://jwt.io/).

### Listening

* [Charli XCX](https://open.spotify.com/artist/25uiPmTg16RbhZWAqwLBy5?si=FaN5C-J1SIe5P0zax6Uf4g),
  supposedly this is called [Hyperpop](https://en.wikipedia.org/wiki/Hyperpop), and I like it.
* [Verboten Berlin](https://open.spotify.com/artist/6RNhl0w2Lfem0Xjy3l0LKX?si=14MnN3y6SbWv2I6fmQB9gQ),
  electronic/dance music.

{{<rawhtml>}}
<iframe src="https://open.spotify.com/embed/track/0fz8uK5GuDnpWVuay7BWKw" width="300" height="380" frameborder="0" allowtransparency="true" allow="encrypted-media"></iframe>
{{</rawhtml>}}

### Coffee

* Columbia Doris María by [Zoban](https://prazirnazoban.cz/)
* Honduras Caballeros [Zoban](https://prazirnazoban.cz/)

