package main

import (
  "fmt"
  "math"
  "os"
  "os/exec"
  "strconv"
  "strings"
  "text/template"
  "time"
)

const tmpl = `
{{define "stats"}}
  {{ round .Time }} hours, {{ round .Distance }} km, {{ if eq .Unit "rides" }}{{ round .Elevation }} m ↑, {{end}}{{ .Count }} {{ .Unit }}
{{end}}
<div><b>Net Worth</b>: €{{ .NetWorth }} (<span class="{{ tag .NetWorth }}">{{ if lt .NetWorthChange 0. }}-{{else}}+{{end}}€{{ .NetWorthChange }}</span>)</div>
<div><b>Running</b>: {{template "stats" .Running }}</div>
<div><b>Cycling</b>: {{template "stats" .Cycling }}</div>
<div><b>Swimming</b>: {{template "stats" .Swimming }}</div>
<div><b>Activity Totals</b>: {{template "stats" .Totals }}</div>
`

func getAmount(ledgerOutput string) (string, error) {
  lines := strings.Split(ledgerOutput, "\n")
  if len(lines) < 2 {
    return "", fmt.Errorf("invalid output of ledger command")
  }
  bal := strings.TrimSpace(lines[len(lines)-2])
  return bal, nil
}

func tag(i interface{}) string {
  var better bool
  switch i.(type) {
  case int64:
    better = i.(int64) > 0
  case float64:
    better = i.(float64) > 0
  default:
    panic("invalid type")
  }
  if better {
    return "green"
  }
  return "red"
}

func assetsChange(t time.Time) (float64, error) {
  t = time.Date(t.Year(), t.Month(), t.Day(), 0, 0, 0, 0, t.Location())
  cmd := exec.Command("ledger", "bal", "-X", "EUR", "-p", fmt.Sprintf("%s %d", t.Month(), t.Year()), "assets", "liabilities")
  data, err := cmd.Output()
  if err != nil {
    return 0, err
  }
  amount, err := getAmount(string(data))
  if err != nil {
    return 0, err
  }
  amount = strings.ReplaceAll(strings.TrimPrefix(amount, "€"), ",", "")
  a, err := strconv.ParseFloat(amount, 64)
  if err != nil {
    return 0, fmt.Errorf("invalid amount '%q' in s: %w", amount, err)
  }
  return a, nil
}

func assetsTotal(t time.Time) (float64, error) {
  // until needs to be the "next" month so that we include also the net worth gained in the last month
  // that is, the change in net worth is included in the total net worth
  t = time.Date(t.Year(), t.Month()+1, t.Day(), 0, 0, 0, 0, t.Location())
  cmd := exec.Command("ledger", "bal", "-X", "EUR", "-p", fmt.Sprintf("until %s %d", t.Month(), t.Year()), "assets", "liabilities")
  data, err := cmd.Output()
  if err != nil {
    return 0, err
  }
  amount, err := getAmount(string(data))
  if err != nil {
    return 0, err
  }
  amount = strings.ReplaceAll(strings.TrimPrefix(amount, "€"), ",", "")
  a, err := strconv.ParseFloat(amount, 64)
  if err != nil {
    return 0, fmt.Errorf("invalid amount '%q' in s: %w", amount, err)
  }
  return a, nil
}

type SportStat struct {
  Time      float64
  Distance  float64
  Elevation float64
  Count     int64
  Unit      string
}

func parseSportStatsString(s string) (*SportStat, error) {
  s = strings.TrimSpace(s)
  parts := strings.Split(s, ",")
  if len(parts) != 4 {
    return nil, fmt.Errorf("output should contain 3 numbers")
  }
  if parts[3] == "0" {
    return &SportStat{}, nil
  }
  t, err := strconv.ParseFloat(parts[0], 64)
  if err != nil {
    return nil, fmt.Errorf("invalid time '%q' in s: %w", parts[0], err)
  }
  distance, err := strconv.ParseFloat(parts[1], 64)
  if err != nil {
    return nil, fmt.Errorf("invalid distnace '%q' in s: %w", parts[1], err)
  }
  elevation, err := strconv.ParseFloat(parts[2], 64)
  if err != nil {
    return nil, fmt.Errorf("invalid elevation '%q' in s: %w", parts[2], err)
  }
  count, err := strconv.ParseInt(parts[3], 10, 64)
  if err != nil {
    return nil, fmt.Errorf("invalid count '%q' in s: %w", parts[3], err)
  }
  return &SportStat{
    Time:      t,
    Distance:  distance,
    Elevation: elevation,
    Count:     count,
  }, nil
}

func buildSportStats(thisMonth string) (*SportStat, error) {
  latestStats, err := parseSportStatsString(thisMonth)
  if err != nil {
    return nil, err
  }
  return latestStats, nil
}

func sportStats(t time.Time, optSportType ...string) (*SportStat, error) {
  dateQuery := t.Format("Jan%%2006%%")
  query := fmt.Sprintf(`SELECT SUM(ALL moving_time)/3600.0 AS total_time, SUM(ALL distance) AS total_distance,
SUM(ALL elevation_gain) AS total_elevation, COUNT() AS total_activities
FROM activities.csv WHERE activity_date LIKE '%s'`, dateQuery)
  if len(optSportType) > 0 {
    query += fmt.Sprintf(" AND activity_type == '%s'", optSportType[0])
  }
  cmd := exec.Command("q", "-H", "-d", ",", query)
  data, err := cmd.Output()
  if err != nil {
    return nil, err
  }
  return buildSportStats(string(data))
}

func main() {
  // TODO: configurable
  asOf := time.Date(2020, 12, 01, 0, 0, 0, 0, time.UTC)

  netWorth, err := assetsTotal(asOf)
  if err != nil {
    panic(err)
  }
  netWorthChange, err := assetsChange(asOf)
  if err != nil {
    panic(err)
  }
  running, err := sportStats(asOf, "Run")
  if err != nil {
    panic(err)
  }
  running.Unit = "runs"
  cycling, err := sportStats(asOf, "Ride")
  if err != nil {
    panic(err)
  }
  cycling.Unit = "rides"
  swimming, err := sportStats(asOf, "Swim")
  if err != nil {
    panic(err)
  }
  swimming.Unit = "swims"
  totals, err := sportStats(asOf)
  if err != nil {
    panic(err)
  }
  totals.Unit = "activities"

  tmpl, err := template.New("stat").Funcs(template.FuncMap{
    "round": func(f float64) float64 {
      return math.Round(f*100) / 100
    },
    "tag": tag,
  }).Parse(tmpl)
  if err != nil {
    panic(err)
  }
  err = tmpl.Execute(os.Stdout, map[string]interface{}{
    "NetWorth":       netWorth,
    "NetWorthChange": netWorthChange,
    "Running":        running,
    "Cycling":        cycling,
    "Swimming":       swimming,
    "Totals":         totals,
  })
  if err != nil {
    panic(err)
  }
}
