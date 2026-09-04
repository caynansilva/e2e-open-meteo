# SDET Interview Rules

This is Caynan Ramos Silva's SDET interview project. This document is the authoritative source for the exercise requirements and acceptance criteria.

## Required workflow

1. Inspect relevant, read-only Open-Meteo reference code in `.codebase/open-meteo-main` before creating scenarios.
2. Define behavior in Cucumber/Gherkin files under `e2e-tests/`.
3. Generate the matching spec and Steps skeleton with `npm run g2f <feature-file>`.
4. Keep specs minimal and delegate uppercase Step commands to the Steps class.
5. Test API behavior against live Open-Meteo endpoints, not localhost.

## Feature ticket

### Activity Ranking API – City-Based Weather Forecast Integration

As a user, I want to enter a city or town name and receive a ranked list of activities (Skiing, Surfing, Outdoor Sightseeing, Indoor Sightseeing) for the next 7 days, based on weather conditions.

This is an API exercise. Consider the front-end user experience when defining API behavior.

### Acceptance criteria

- The API accepts a city or town name as input.
- It accepts a partial name and returns a list of possible matches.
- It fetches seven-day weather data using Open-Meteo.
- It ranks each day for each activity based on weather suitability.
- The response includes, for every day and activity:
  - date;
  - activity name;
  - a suitability measure;
  - human-readable reasoning, such as `High snowfall expected` or `Clear skies and 22°C`.

## Deliverables and constraints

Provide Gherkin BDD scenarios, runnable automated tests aligned to those scenarios, and a README. This is specification-first work: when no system implementation exists, write meaningful tests that establish the intended behavior.

Use live Open-Meteo APIs. The forecast endpoint is `https://api.open-meteo.com/v1/forecast`; geocoding is available at `https://geocoding-api.open-meteo.com/v1/search`.
