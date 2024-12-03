---
title: Reading the Azerothcore codebase
date: 2024-12-02
---

Whiles on sabbatical in New Zealand I have been reading on game development and nostalgically remembering the years I have spent playing video games for the majority of my free time. The fondest memories I have are of World of Warcraft and the endless hours of leveling, raiding, and completing daily quests. Now I am completing the journey from the other side couple of years later, reading through the code base of [Azerothcore](https://github.com/azerothcore/azerothcore-wotlk), an open-source WoW server for the [Wrath of the Lich King](https://en.wikipedia.org/wiki/World_of_Warcraft:_Wrath_of_the_Lich_King)  expansion which is at this point 16 years old.

Getting a glimpse of the machinery behind one of the greatest MMOs of all time is a surprisingly fun endeavor. The code base is exceptionally well organized and easy to navigate even as a complete novice. For example, many of the game entities are defined as standalone [scripts](https://github.com/azerothcore/azerothcore-wotlk/tree/master/src/server/scripts) that define hooks for the main event loop which leaves the core classes clean while providing necessary customization for a rich game world.

I have no takeaway to wrap this up with except that writing game servers after all, doesn't seem that different from building large monolithic APIs. Clear naming and good abstractions go a long way.