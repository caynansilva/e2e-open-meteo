# Project Context

This repository is Caynan Ramos Silva's SDET interview project. Read [the interview rules](./RULES.md) before creating or changing tests.

## Authoring flow

```text
Open-Meteo reference checkout
  ↓
e2e-tests/*.feature
  ↓ npm run g2f
src/Tests/specs/*.spec.ts + src/Tests/Steps/*.steps.ts
  ↓
Page Object or API client
  ↓
Live Open-Meteo service or browser
```

Use `.codebase/open-meteo-main` as read-only evidence for endpoints, parameters, and response shapes. It is not the feature implementation.

The spec is a direct Gherkin phrase-to-command map. Its commands delegate to uppercase, underscore-separated public methods in the Steps class. Steps group Page Object behavior and API-client behavior to achieve the scenario objective. See [the Cucumber test structure](./cucumber-test-structure.md) for the minimal `CucumberWorld` pattern.

## Project skills

- `open-meteo-context` grounds scenario decisions in the Rules and the reference checkout.
- `cucumber-test-generator` creates or refactors the Gherkin, spec, and Steps workflow.

## Live Open-Meteo API

API tests use live endpoints, not localhost. Forecast requests use `https://api.open-meteo.com/v1/forecast`.

```bash
curl "https://api.open-meteo.com/v1/forecast?latitude=52.52&longitude=13.41&current=temperature_2m,wind_speed_10m&hourly=temperature_2m,relative_humidity_2m,wind_speed_10m"
```

The response includes a `current` object with observation time and requested current values, plus aligned `hourly.time`, `hourly.temperature_2m`, `hourly.relative_humidity_2m`, and `hourly.wind_speed_10m` arrays. Request only variables needed by the scenario and assert the response contract appropriate to the feature.
