# 2026-09-05 00:35 - Global Cucumber Binding Cleanup

## Status
- [ ] Pending review
- [x] Implemented

## Objective
Eliminate globally ambiguous Cucumber bindings while preserving the existing feature-local execution model.

## Related Functionality
- Feature/module: `e2e-tests` and `src/Tests`
- Trigger: user request / implementation plan

## What Changed
- Renamed repeated Given and When phrases with feature-specific business context.
- Renamed the corresponding feature-specific Steps methods.
- Removed the deleted shared binding/helper files from explicit Cucumber loading.
- Preserved the existing fixture and assertion behavior.

## Files Changed
| File | Change |
|------|--------|
| `cucumber.js` | Removed the deleted shared spec from explicit feature loading. |
| `e2e-tests/*.feature` | Updated repeated Given/When phrases to unique feature-specific wording. |
| `src/Tests/specs/*.spec.ts` | Synchronized binding phrases and renamed method calls. |
| `src/Tests/Steps/*.steps.ts` | Renamed corresponding setup/response methods. |
| `src/Tests/Steps/ActivityRankingShared.steps.ts` | Deleted per user direction. |
| `src/Tests/specs/ActivityRankingShared.spec.ts` | Deleted per user direction. |
| `src/BaseClass.ts` | Removed stale shared-helper imports from the deleted helper. |
| `src/Utils/WebHelper.ts` | Preserved the equivalent lint-safe assertion implementation. |

## Implementation Details
The final suite contains 52 unique binding expressions. Scenario state and fixture behavior remain in the existing feature-specific Steps classes; no business logic was added to binding adapters.

## Results
- Expected outcome: no ambiguous or undefined steps in global execution.
- Actual outcome: 16 scenarios and 52 steps passed in both execution modes.

## Validation
| Check | Command / action | Result |
|-------|------------------|--------|
| Duplicate scan | Binding-expression scan across `src/Tests/specs/*.spec.ts` | 52 unique expressions |
| Global tests | `npm test` | pass: 16 scenarios, 52 steps |
| Feature-by-feature tests | `npm run test:all` | pass: all features |
| Typecheck | `npm run typecheck` | pass |
| Lint | `npm run lint` | pass: 0 errors, 5 warnings |

## Behavior Impact
- Business behavior and fixture-backed assertions are unchanged.
- Feature wording now distinguishes previously duplicated binding intents.

## Risks and Follow-ups
- Existing console warnings remain in `BaseClass.ts` and `WebHelper.ts`.
