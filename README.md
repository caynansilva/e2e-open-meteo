# Open-Meteo SDET Interview Project

Caynan Ramos Silva's SDET interview project for specification-first Cucumber/Gherkin testing of an Open-Meteo-backed Activity Ranking API.

Read [the interview rules](./docs/RULES.md) and [project context](./docs/project-context.md) before creating or changing tests.

## Architecture

```text
.feature
   ↓
Native Cucumber Given / When / Then bindings
   ↓
Uppercase Steps commands with minimal CucumberWorld access
   ↓
Page Object or API Client
   ↓
Playwright or HTTP
```

- Cucumber is the runner for `.feature` files.
- Playwright is the browser automation engine used by UI Page Objects.
- `WebPage` and `WebElement` provide reusable browser behavior.
- API clients contain endpoint communication and do not initialize browsers.
- Specs return Step commands directly; Steps access the scenario-scoped World through Cucumber's official `world` proxy.

## Project structure

```text
e2e-tests/
  google-search.feature
  activity-ranking.feature

src/
  PageObjects/
    Sample/GooglePage.ts
  Support/
    CucumberWorld.ts
    hooks.ts
  Tests/
    api/ActivityRankingApiClient.ts
    specs/
      01_GOOGLE_SEARCH.spec.ts
      02_METEOR_ACTIVITY_RANKING.spec.ts
    Steps/
      01_GOOGLE_SEARCH.steps.ts
      02_METEOR_ACTIVITY_RANKING.steps.ts
```

## Getting started

Requirements: Node.js 18 or later.

```bash
npm install
npx playwright install
```

## Running features

Run every feature:

```bash
npm test
```

Run one feature:

```bash
npm test -- e2e-tests/activity-ranking.feature
```

The equivalent direct command is:

```bash
npx cucumber-js e2e-tests/google-search.feature
```

UI scenarios use the `@ui` tag and launch Chromium through Cucumber hooks. API scenarios use `@api` and do not launch Chromium.

The Activity Ranking feature calls live Open-Meteo APIs, never a localhost ranking service:

```text
GET https://geocoding-api.open-meteo.com/v1/search?name={city}
GET https://api.open-meteo.com/v1/forecast?latitude={lat}&longitude={lon}&daily=...&forecast_days=7
```

See [the API contract](./docs/activity-ranking-api-contract.md).

See [the Cucumber test structure](./docs/cucumber-test-structure.md) for the feature, spec, Steps, and minimal `CucumberWorld` pattern.

## Generating bindings

Generate a native Cucumber spec and matching Steps skeleton from a feature:

```bash
npm run g2f e2e-tests/activity-ranking.feature
```

The generator writes `src/Tests/specs/{name}.spec.ts` and `src/Tests/Steps/{name}.steps.ts`, converts values to Cucumber Expressions, and creates deterministic uppercase Step commands. It preserves the pair if either file already exists; use `--force` only to intentionally replace both. A `.feature` remains the single source of truth.

## Independent Playwright specs

Playwright Test remains available for genuinely independent `*.spec.ts` suites:

```bash
npm run test:playwright
npm run test:headed
npm run test:ui
```

Do not run a `.feature` with `npx playwright test`. Gherkin files are executed by Cucumber.

## Useful commands

```bash
npm run typecheck
npm run build
npx eslint .
npx cucumber-js --dry-run "e2e-tests/**/*.feature"
```

## Configuration

Environment values can be supplied through `.env` or `.env.local`. API scenarios use live Open-Meteo defaults: `API_LOCAL_URL=https://api.open-meteo.com` and `GEOCODING_API_URL=https://geocoding-api.open-meteo.com`.
