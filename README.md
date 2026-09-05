# Wheather Activity Ranking API — SDET Test

Specification-first BDD test suite for the **Activity Ranking API – City-Based Weather Forecast Integration** exercise.

This project defines the expected behaviour of an API that accepts a city or town name and returns ranked activity recommendations for the next seven days based on weather conditions.

The solution is written in **TypeScript** using **Cucumber/Gherkin** and follows a test-first approach: the expected behaviour, contract, fixtures, and validations are defined before a production API implementation exists.

## Assignment Scope

The API is expected to:

- Accept an exact city or town name.
- Accept a partial city name and return possible matches.
- Use seven-day weather forecast data from Open-Meteo.
- Rank the following activities for every forecast day:
  - Skiing
  - Surfing
  - Outdoor Sightseeing
  - Indoor Sightseeing
- Return, for each activity:
  - Date
  - Activity name
  - Suitability measure
  - Reasoning for the recommendation

The repository contains the requested deliverables:

1. Gherkin BDD scenarios.
2. Runnable automated tests implementing those scenarios.
3. Documentation of the approach, assumed contract, dependency strategy, assumptions, omissions, and trade-offs.

## Test Approach

The suite is organized around business behaviour rather than implementation details.

```text
.feature
   ↓
Native Cucumber Given / When / Then bindings
   ↓
Feature/domain Steps classes
   ↓
ActivityManager reusable validations
   ↓
Controlled test fixtures / future API client
```

### Responsibilities

- **Feature files** describe expected behaviour in business-readable Gherkin.
- **Cucumber specs** register phrases and delegate execution to Steps classes.
- **Steps classes** prepare scenario data and coordinate assertions.
- **ActivityManager** contains reusable domain validations.
- **MockCityActivitiesFactory** creates controlled city, forecast, activity, and error responses.
- **CucumberWorld** provides scenario-scoped state shared between steps.

## Project Structure

```text
e2e-tests/
  SC-01.1-Validate_Exact_City_Search.feature
  SC-01.2-Validate_Partial_City_Search.feature
  ...
  SC-05.3-Validate_Suitability_Value_Range.feature

src/
  PageObjects/
    CityActivities.ts

  Tests/
    specs/
      ActivityRankingShared.spec.ts
      SC-*.spec.ts
    Steps/
      ActivityRankingShared.steps.ts
      SC-*.steps.ts

  Support/
    CucumberWorld.ts
    hooks.ts

  fixtures/
    MockCityActivitiesFactory.ts
    Sample.json

  Types/
    index.ts

  BaseClass.ts

tools/
  GherkinToFunctions/
    gherkin-to-functions.ts
    README.md
  run-cucumber-features.js

docs/
  01-CaynanReasoning-Scenarios.md
  SDET-Test.md
  cucumber-test-creation.md
```

## Scenario Coverage

The suite contains **16 BDD scenarios** grouped into five areas.

| Group | Coverage |
| --- | --- |
| SC-01 — City Search | Exact city, partial city, ambiguous matches, result limit |
| SC-02 — Response Contract | Invalid city, required fields, forecast-day activity data |
| SC-03 — Forecast Days | Seven days, starts tomorrow, sequential dates, no duplicates |
| SC-04 — Activity Recommendations | Weather impact, supported activities, reasoning |
| SC-05 — Activity Ranking | Suitability score, descending order, accepted range |

The scenarios cover both the explicit acceptance criteria and behaviours that are important for a front-end consumer, such as predictable date ordering, complete activity data, bounded suitability values, and useful error responses.

## Assumed API Contract

Because no production implementation or formal API contract was supplied, the project defines a minimal contract based on the feature requirements.

### Successful response

```json
{
  "name": "London",
  "currentDate": "2026-09-04",
  "forecastDays": [
    {
      "date": "2026-09-05",
      "activities": [
        {
          "activityName": "Skiing",
          "activitySuitability": 95,
          "activityReason": "High snowfall expected"
        }
      ]
    }
  ]
}
```

### Contract rules

- `name` identifies the resolved city.
- `currentDate` is the reference date for the forecast window.
- `forecastDays` contains exactly seven entries.
- The first forecast day is the next calendar day.
- Forecast dates are sequential and contain no duplicates.
- Every forecast day contains all four supported activities.
- `activitySuitability` is a numeric score from `0` to `100`.
- Activities are ordered from highest to lowest suitability.
- `activityReason` is a non-empty explanation of the recommendation.

### Partial city search

A partial city name is expected to return a collection of matching city results. The suite also verifies that the number of returned matches can be limited.

### Invalid city

The current assumed error shape is:

```json
{
  "error": "City 'Atlantis' could not be found."
}
```

The client’s endpoint path, HTTP status handling, and transport-level error format are explicit assumptions until a formal API specification is available.

## Activity Ranking API Client Configuration

The reusable HTTP client reads its base URL from `ACTIVITY_RANKING_API_BASE_URL`:

```bash
ACTIVITY_RANKING_API_BASE_URL=http://localhost:3000
```

The current client assumption is a single `GET /activities` endpoint. Exact and partial city searches use the `city` query parameter, and partial searches may also send `limit`:

```text
/activities?city=London
/activities?city=San&limit=2
```

The Activity Ranking API is intentionally not implemented in this repository. The client defines the expected HTTP boundary and will surface connection or HTTP errors until a real system under test is available. Open-Meteo remains outside the client and will be mocked at the production API's external dependency boundary later.

## Open-Meteo Dependency Strategy

The production feature is expected to obtain weather data from **Open-Meteo**.

The current specification suite does **not** make live calls to the public Open-Meteo service. Controlled fixtures are used instead so that the tests remain:

- Deterministic.
- Fast.
- Independent from internet availability.
- Independent from third-party outages or data changes.
- Able to reproduce specific weather-related ranking examples.

The suite includes deterministic examples such as high snowfall producing a high Skiing score and clear conditions producing a higher Outdoor Sightseeing score.

When an Activity Ranking API implementation exists, the preferred approach is to send real requests to that API while mocking or stubbing **Open-Meteo at the external dependency boundary**. A smaller integration suite can separately verify compatibility with the real Open-Meteo service.

## Mocking Strategy

`MockCityActivitiesFactory` provides reusable builders for:

- Valid city responses.
- Partial city matches.
- Invalid-city errors.
- Seven sequential forecast days.
- Random activity suitability values.
- Explicit scores and reasoning.
- Deterministic weather-sensitive responses.

Random values are used when the exact value is not relevant to the scenario. Deterministic values are used whenever a test needs to verify a specific ranking or weather relationship.

## Running the Tests

### Requirements

- Node.js 20+
- npm

Install dependencies from the lockfile:

```bash
npm ci
```

### Validate the repository

Run the TypeScript typecheck, ESLint, and all Cucumber scenarios:

```bash
npm run validate
```

### Run all Cucumber features

```bash
npm run test:all
```

### Run one feature

```bash
npx cucumber-js e2e-tests/SC-01.1-Validate_Exact_City_Search.feature
```

### Static checks

```bash
npm run typecheck
npm run lint
```

## Latest Cucumber Result

```text
16 scenarios passed
52 steps passed
0 failed scenarios
All Cucumber features passed
```

The current suite therefore validates the BDD specification successfully against the controlled test fixtures.

## Gherkin-to-Cucumber Generator

The repository includes a helper that generates native Cucumber binding and Steps skeletons from existing `.feature` files.

```bash
npm run g2f -- e2e-tests/SC-01.1-Validate_Exact_City_Search.feature
```

Generated files are placed under:

```text
src/Tests/specs/
src/Tests/Steps/
```

The `.feature` file remains the source of truth. Generated specs are intended to stay thin, while reusable test behaviour belongs in the Steps and domain/helper layers.

## Assumptions

The following decisions were necessary because the exercise intentionally provides no implementation:

- Suitability is represented by a score from `0` to `100`.
- A higher score means better suitability.
- Activities are ordered in descending suitability order.
- The forecast begins on the day after `currentDate`.
- Every day contains all four supported activities.
- A partial city name may return multiple matches.
- Limiting partial-search results is useful for a front-end consumer.
- Invalid cities return a clear error response.
- The current TypeScript property names represent the assumed contract and may be adapted once a formal API contract exists.

## Known Omissions and Trade-offs

### No production Activity Ranking API

This is a specification-first exercise and no system under test was supplied. The repository therefore defines expected behaviour before the production API exists.

### Direct HTTP API scenarios are not implemented yet

The current scenarios validate the expected contract and domain behaviour using controlled data rather than HTTP requests to a running Activity Ranking API. The `ActivityRankingApiClient` is available for future HTTP-backed Steps, but existing fixture-backed scenarios have not been migrated.

When the API becomes available, the next layer should wire these business scenarios to the existing `ActivityRankingApiClient` and execute them against real HTTP responses.

### Open-Meteo is not called directly

The public Open-Meteo service is deliberately excluded from the specification suite. Weather-sensitive outcomes are represented with controlled fixtures.

### The ranking formula is not over-specified

The feature requires weather-based rankings but does not define an exact scoring algorithm. The tests therefore validate observable rules — score range, ordering, supported activities, reasoning, and selected deterministic weather examples — without inventing a complete production formula.

### Geographic suitability is outside the current scope

A production recommendation engine could also consider whether a location is appropriate for activities such as Skiing or Surfing. This was intentionally excluded because it is not part of the supplied acceptance criteria.

## Design Principles

The implementation aims to remain:

- **Specification-first** — behaviour is defined before implementation.
- **Readable** — Gherkin describes business intent.
- **Reusable** — common validations live in shared domain methods.
- **Maintainable** — bindings, workflows, fixtures, and validations have separate responsibilities.
- **Deterministic** — external dependencies are controlled during specification testing.
- **Extensible** — fixture-backed responses can later be replaced by a real API client without rewriting the business scenarios.

## AI Usage

AI-assisted development was used to help review scenario coverage, generate/refactor repetitive Cucumber bindings, and improve the test structure. Generated code was reviewed and adapted to the intended BDD behaviour and repository architecture before being accepted.

## Additional Documentation

- [`docs/SDET-Test.md`](./docs/SDET-Test.md) — original exercise description.
- [`docs/01-CaynanReasoning-Scenarios.md`](./docs/01-CaynanReasoning-Scenarios.md) — scenario reasoning and early contract considerations.
- [`docs/cucumber-test-creation.md`](./docs/cucumber-test-creation.md) — Cucumber test creation guidance.
- [`tools/GherkinToFunctions/README.md`](./tools/GherkinToFunctions/README.md) — generator usage.

## Author

**Caynan Ramos Silva**
