# Cucumber Test Structure

## Flow

```text
.feature
  ↓
src/Tests/specs/*.spec.ts
  ↓
src/Tests/Steps/*.steps.ts
  ↓
Page Object or API client
  ↓
Playwright browser or HTTP dependency
```

The `.feature` file is the business-readable source of scenario behavior. The spec registers those phrases with Cucumber. The Steps class owns workflows, assertions, and scenario data access. Page Objects own UI selectors and atomic browser interactions; API clients own HTTP calls.

## Minimal CucumberWorld pattern

Specs do not import `CucumberWorld`, receive `this`, or pass a World argument. They return the Step command directly so Cucumber waits for asynchronous work:

```ts
When("the user opens Google", () => steps.NAVIGATE_TO_GOOGLE());
```

Each Steps class accesses the current scenario through Cucumber's proxy:

```ts
import { world as cucumberWorld } from "@cucumber/cucumber";
import { CucumberWorld } from "../../Support/CucumberWorld";

private get world(): CucumberWorld {
  return cucumberWorld as CucumberWorld;
}
```

Public Step commands use uppercase words separated by underscores, such as `NAVIGATE_TO_GOOGLE` and `VERIFY_RESPONSE_STATUS`. They read scenario state through `this.world` and never accept or store a World instance.

The proxy is available only while Cucumber executes a step or case-level hook. Hooks may continue to use `this: CucumberWorld` because they need lifecycle metadata and setup/teardown context.

## Generate a new pair

Run:

```bash
npm run g2f e2e-tests/my-feature.feature
```

The generator creates:

```text
src/Tests/specs/my-feature.spec.ts
src/Tests/Steps/my-feature.steps.ts
```

The spec is a direct phrase-to-command map. The Steps file contains a private World getter and deterministic uppercase command stubs. Implement those stubs with Page Objects or API clients. The generator preserves the pair if either output exists; pass `--force` only to deliberately replace both files.

## Run tests

```bash
npx cucumber-js --dry-run "e2e-tests/**/*.feature"
npm test
```
