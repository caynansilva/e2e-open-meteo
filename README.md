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
ActivityRankingClient abstraction
   ├─ FixtureActivityRankingClient
   └─ ActivityRankingApiClient
   ↓
ActivityManager reusable validations
```

### Responsibilities

- **Feature files** describe expected behaviour in business-readable Gherkin.
- **Cucumber specs** register phrases and delegate execution to Steps classes.
- **Steps classes** prepare scenario data, call the selected client, and coordinate assertions.
- **ActivityManager** contains reusable domain validations.
- **MockCityActivitiesFactory** creates controlled city, forecast, activity, and error responses.
- **ActivityRankingClient** provides the same async boundary for fixture and SUT execution.
- **CucumberWorld** provides scenario-scoped state shared between steps.

## Project Structure

```text
e2e-tests/
  SC-01.1-Validate_Exact_City_Search.feature
  SC-01.2-Validate_Partial_City_Search.feature
  ...
  SC-05.3-Validate_Suitability_Value_Range.feature
  SC-06.1-Validate_Successful_Activity_Request.feature
  SC-06.2-Validate_Missing_City_Parameter.feature
  SC-06.3-Validate_Empty_City_Parameter.feature
  SC-06.4-Validate_Unknown_City_Response.feature
  SC-06.5-Validate_Invalid_Result_Limit.feature
  SC-06.6-Validate_Unsupported_HTTP_Method.feature
  SC-06.7-Validate_Unknown_Endpoint.feature

src/
  Api/
    ActivityRankingClient.ts
    ActivityRankingApiClient.ts
    ActivityRankingClientFactory.ts
    FixtureActivityRankingClient.ts
    ActivityRankingErrors.ts
    ActivityRankingHttpAssertions.ts
  Mocks/
    OpenMeteo/
      OpenMeteoMockServer.ts
      OpenMeteoFixtures.ts
      OpenMeteoTypes.ts
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

The suite contains **23 BDD scenarios** grouped into six areas.

| Group | Coverage |
| --- | --- |
| SC-01 — City Search | Exact city, partial city, ambiguous matches, result limit |
| SC-02 — Response Contract | Invalid city, required fields, forecast-day activity data |
| SC-03 — Forecast Days | Seven days, starts tomorrow, sequential dates, no duplicates |
| SC-04 — Activity Recommendations | Weather impact, supported activities, reasoning |
| SC-05 — Activity Ranking | Suitability score, descending order, accepted range |
| SC-06 — HTTP Contract | Endpoint, method, query, status, content type, error behaviour |

The scenarios cover both the explicit acceptance criteria and behaviours that are important for a front-end consumer, such as predictable date ordering, complete activity data, bounded suitability values, and useful error responses.

## SC-06 — HTTP Contract Coverage

SC-06 defines the assumed HTTP contract for the future Activity Ranking API. These scenarios are tagged `@api-contract` and `@sut` so they can be run independently with `npm run test:api-contract`.

| Behaviour | Expected status |
| --- | ---: |
| Valid GET `/activities` | 200 |
| Missing city | 400 |
| Empty city | 400 |
| Unknown city | 404 |
| Invalid limit | 400 |
| Unsupported HTTP method | 405 |
| Unknown endpoint | 404 |

This is specification-first contract coverage: the statuses, endpoint behavior, and lightweight error messages are assumptions until a production SUT or formal API definition confirms them. SC-06 does not add fixture behavior or a fake API, so it is expected to remain red while the Activity Ranking API is absent.

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

The Activity Ranking API is intentionally not implemented in this repository. The SUT client defines the expected HTTP boundary and surfaces connection or HTTP errors when the API is unavailable. Fixture and SUT execution use the same feature files, bindings, Steps, and assertions. Open-Meteo is represented separately by a standalone upstream dependency mock; it never returns Activity Ranking API responses.

### Test target configuration

`ACTIVITY_RANKING_TEST_TARGET` is required and must be one of:

```text
fixture
sut
```

`ACTIVITY_RANKING_API_BASE_URL` configures the SUT base URL and defaults to:

```text
http://localhost:3000
```

An unset or unsupported test target fails fast with a configuration error. SUT failures are never replaced with fixture data.

## Open-Meteo Dependency Strategy

The production feature is expected to obtain weather data from **Open-Meteo**. The test boundary is intentionally arranged as:

```text
Cucumber Tests
      ↓
ActivityRankingApiClient
      ↓
Activity Ranking API (not implemented)
      ↓
Open-Meteo Mock Server
```

The standalone mock implements only the upstream dependency routes needed by a future Activity Ranking API:

- `GET /v1/search` — deterministic exact, partial, ambiguous, limited, and empty geocoding results.
- `GET /v1/forecast` — seven sequential dates and deterministic temperature, precipitation, snowfall, wind, and weather-code inputs.

It contains no activity names, suitability values, ranking output, or recommendation reasoning. Start it separately when developing a future SUT integration:

```bash
npm run mock:open-meteo
```

The default address is `http://127.0.0.1:4010`. Override it with `OPEN_METEO_MOCK_HOST` and `OPEN_METEO_MOCK_PORT`. A future Activity Ranking API can consume it through `OPEN_METEO_BASE_URL`, or through separate geocoding and forecast base URLs. Those variables belong to the future SUT and are deliberately not read by `ActivityRankingApiClient`.

The mock is verified independently with:

```bash
npm run test:open-meteo-mock
```

The current specification suite does **not** make live calls to the public Open-Meteo service or automatically start the mock. Controlled fixtures remain available so that the BDD tests stay:

- Deterministic.
- Fast.
- Independent from internet availability.
- Independent from third-party outages or data changes.
- Able to reproduce specific weather-related ranking examples.

The suite includes deterministic examples such as high snowfall producing a high Skiing score and clear conditions producing a higher Outdoor Sightseeing score.

When an Activity Ranking API implementation exists, it can be started against this mock and then exercised through `ActivityRankingApiClient`. This keeps deterministic weather inputs at the external dependency boundary while preserving meaningful SUT failures when the Activity Ranking API itself is absent. Live Open-Meteo availability must not determine normal BDD suite reliability.

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

Run the TypeScript typecheck, ESLint, Open-Meteo mock verification, and all fixture-backed Cucumber scenarios:

```bash
npm run validate
```

### Fixture-backed specification validation

```bash
npm run test:fixture
```

Expected: **16 scenarios passing**. This validates the SC-01–SC-05 business specifications deterministically without a production API; `@api-contract` scenarios are excluded.

### API contract specification execution

```bash
npm run test:api-contract
```

Expected while no Activity Ranking API exists: **RED — Activity Ranking API transport failure**. Once the SUT is available, the seven scenarios validate the assumed endpoint, query, method, status, content type, and error contracts.

### SUT-backed specification execution

```bash
npm run test:sut
```

Expected while no Activity Ranking API exists: **RED — Activity Ranking API connection failure**. This red state is intentional: it proves the same runnable specification reaches the configured HTTP boundary and fails because the expected production system is absent.

### Run all Cucumber features

```bash
npm run test:all
```

### Run one feature

```bash
npm run test:fixture -- e2e-tests/SC-01.1-Validate_Exact_City_Search.feature
```

### Static checks

```bash
npm run typecheck
npm run lint
```

## Latest Cucumber Result

```text
Fixture target: 16 scenarios passed
Fixture target: 52 steps passed
0 failed scenarios
All Cucumber features passed
```

The fixture target validates the BDD specification successfully against controlled test fixtures. The default `npm test` command selects the SUT target, so it is expected to be red until the Activity Ranking API is implemented and running.

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

### SUT-backed scenarios are intentionally red until implementation exists

The current scenarios can now execute through either controlled fixtures or the existing HTTP client. SUT mode fails when the configured Activity Ranking API is unavailable, which is intentional for this specification-first stage. Network failures propagate, while typed HTTP error responses can be validated by the existing assertions.

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
