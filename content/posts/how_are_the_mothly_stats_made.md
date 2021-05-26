---
title: "How are the Monthly Stats Made"
date: 2021-06-01
slug: how_are_the_monthly_stats_made
draft: true
tags: ["writing"]
---

# Stats

- find current net worth: `ledger bal -X EUR assets liabilities`
- find net worth change for last month: `ledger bal -X EUR -p 'last month' assets liabilities`

## Sports

- download the archive from strava
- fix the csv file:
  - replace space in header with underscores (`:s/ /_/g` on first line)
  - lowercase all strings (`v$u` on first line)
  - manually fix any other issues
- run following queries and paste the data into the markdown file for given month:
  ```shell
  q -O -H -d , "SELECT SUM(ALL moving_time)/3600.0 AS total_time, SUM(ALL distance) AS total_distance, COUNT() AS total_activities FROM activities.csv WHERE activity_date LIKE 'Apr%2021%' AND activity_type == 'Run'"
  q -O -H -d , "SELECT SUM(ALL moving_time)/3600.0 AS total_time, SUM(ALL distance) AS total_distance, COUNT() AS total_activities FROM activities.csv WHERE activity_date LIKE 'Apr%2021%' AND activity_type == 'Ride'"
  q -O -H -d , "SELECT SUM(ALL moving_time)/3600.0 AS total_time, SUM(ALL distance) AS total_distance, COUNT() AS total_activities FROM activities.csv WHERE activity_date LIKE 'Apr%2021%' AND activity_type == 'Swim'"
  ```
