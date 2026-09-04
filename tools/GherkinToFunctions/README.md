# Gherkin to native Cucumber spec and Steps generator

This generator creates a matching Cucumber binding spec and Steps-class skeleton for each existing `.feature` file. Cucumber remains the runner and the feature remains the only scenario specification.

## Usage

Generate one file:

```bash
npm run g2f e2e-tests/activity-ranking.feature
```

Generate bindings for every feature below a directory:

```bash
npm run g2f -- --dir e2e-tests
```

The default output pair is:

```text
src/Tests/specs/{feature-name}.spec.ts
src/Tests/Steps/{feature-name}.steps.ts
```

Use `--force` to intentionally replace an existing binding file:

```bash
npm run g2f e2e-tests/activity-ranking.feature --force
```

Without `--force`, the generator preserves both outputs when either file already exists. Use `--force` only when intentionally replacing the pair.

## Generated shape

The generated spec contains only native Cucumber registrations and returns each Steps command directly:

```typescript
import { Given, Then, When } from "@cucumber/cucumber";
import { ActivityRankingApiSteps } from "../Steps/activity-ranking.steps";

const steps = new ActivityRankingApiSteps();

When("I request activity rankings for {string}", (city: string) => steps.I_REQUEST_ACTIVITY_RANKINGS_FOR_STRING(city));
```

The generated Steps class exposes the current scenario through the official Cucumber `world` proxy and creates uppercase command stubs that fail explicitly until implemented.

Quoted values become `{string}` and integer values become `{int}`. Duplicate expressions are emitted once. `And` and `But` reuse the preceding effective keyword, so no `And` binding or custom Step Class is generated.

Steps with a table receive a native `DataTable` argument. `Background`, `Scenario Outline`, and `Examples` are parsed only to discover their step expressions; Cucumber executes their lifecycle and example rows.

The generator emits only the bindings and Steps skeleton needed by Cucumber and does not create a second scenario representation or runner mode.

## Runtime flow

```text
.feature
   ↓
Native Cucumber Given / When / Then bindings
   ↓
Steps class with minimal CucumberWorld proxy
   ↓
Page Object or API Client
   ↓
Playwright or HTTP
```

Implement UI behavior through Page Objects and API behavior through API clients. Do not place selectors or browser initialization in API bindings.
