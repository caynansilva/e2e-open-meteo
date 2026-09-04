# Activity Ranking API Contract

The Cucumber suite talks to the public Open-Meteo APIs and maps the weather into activity rankings. There is no localhost ranking service.

## Open-Meteo endpoints used

- Geocoding: `GET https://geocoding-api.open-meteo.com/v1/search?name={city}&count=10&language=en&format=json`
- Forecast: `GET https://api.open-meteo.com/v1/forecast?latitude={lat}&longitude={lon}&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum,snowfall_sum,wind_speed_10m_max,sunshine_duration&forecast_days=7&timezone={timezone|auto}`

`API_LOCAL_URL` defaults to `https://api.open-meteo.com`. `GEOCODING_API_URL` defaults to `https://geocoding-api.open-meteo.com`.

Open-Meteo does not expose `/activity-rankings`. `ActivityRankingApiClient` composes geocoding plus a 7-day forecast, then ranks Skiing, Surfing, Outdoor Sightseeing, and Indoor Sightseeing.

## Resolved city response

When the first geocoding result name matches the query (case-insensitive), return `200 OK` with the resolved city and exactly seven `days`.

```json
{
  "city": { "name": "London" },
  "days": [
    {
      "date": "2026-09-05",
      "activities": [
        { "name": "Skiing", "score": 0, "reason": "No snowfall expected" },
        { "name": "Surfing", "score": 75, "reason": "Suitable wave and wind conditions" },
        { "name": "Outdoor Sightseeing", "score": 80, "reason": "Clear skies and 22C" },
        { "name": "Indoor Sightseeing", "score": 40, "reason": "Good weather favors outdoor activities" }
      ]
    }
  ]
}
```

`score` is an integer from 0 through 100, and `reason` is a non-empty string.

## Partial and invalid cities

- A partial city query (first geocoding hit is not an exact name match) returns `200 OK` and `{ "matches": [...] }` with one or more candidate cities; it does not return rankings.
- An unresolvable city (no geocoding `results`) returns `404 Not Found` and `{ "error": "..." }`.
- A weather-provider failure should surface as a failed HTTP call from `https://api.open-meteo.com/v1/forecast`.
