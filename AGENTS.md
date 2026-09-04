# SDET Interview Project Guidelines

This repository is Caynan Ramos Silva's SDET interview project. It defines Cucumber/Gherkin scenarios and runnable TypeScript tests for the Activity Ranking API exercise.

## Mandatory project context

Before answering, documenting, testing, or changing repository files:

- Read `docs/RULES.md` in full; it is the authoritative interview ticket and acceptance criteria.
- For scenario work, inspect the relevant Open-Meteo reference material in `.codebase/open-meteo-main`, starting with its closest OpenAPI document, routes, controllers, tests, or README.
- Keep `.codebase/open-meteo-main` read-only. It is evidence for real Open-Meteo behavior, not the local implementation under test.
- Use the local `open-meteo-context` and `cucumber-test-generator` skills when their scope applies.
- Clearly distinguish Open-Meteo reference behavior from the interview feature contract. State when evidence is unavailable rather than inventing it.

## Test authoring flow

1. Analyze the Rules and relevant Open-Meteo reference behavior.
2. Write business-readable Cucumber/Gherkin scenarios in `e2e-tests/`.
3. Run `npm run g2f <feature-file>` to generate the matching spec and Steps pair.
4. Keep the spec as a minimal phrase-to-command map. Its commands are uppercase, underscore-separated Step methods.
5. Implement workflows and assertions in the Steps class. Steps orchestrate Page Objects for UI behavior and API clients for HTTP behavior.

Specs return the Step command directly and do not import or pass `CucumberWorld`. Steps access the scenario-scoped World through the official Cucumber `world` proxy. Hooks may use `this: CucumberWorld` for lifecycle behavior.

## Live API policy

API scenarios run against live Open-Meteo services, never a localhost ranking service. Use `https://api.open-meteo.com/v1/forecast` for forecasts and `https://geocoding-api.open-meteo.com/v1/search` for location lookup when required by the scenario.

## Commands

- `npm test` — run all Cucumber features.
- `npm test -- e2e-tests/<feature>.feature` — run one feature.
- `npm run typecheck` — validate TypeScript.
- `npm run g2f <feature-file>` — generate a spec/Steps pair.
- `npx cucumber-js --dry-run "e2e-tests/**/*.feature"` — confirm binding coverage.

Use Node.js 18 or later. Do not commit `.env`, credentials, or generated runtime artifacts.
