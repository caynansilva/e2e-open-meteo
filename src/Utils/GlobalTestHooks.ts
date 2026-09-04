import { test as base, TestInfo } from "@playwright/test";
import { TestReportManager } from "./TestReportManager";

/**
 * GlobalTestHooks - Extended Playwright test with automatic reporting
 *
 * This module provides:
 * - Extended test fixture with beforeEach/afterEach hooks
 * - Automatic test initialization and finalization
 * - Integration with TestReportManager for reporting
 *
 * Usage:
 * ```typescript
 * import { test, expect } from './Utils/GlobalTestHooks';
 *
 * test('my test', async ({ page }) => {
 *   // Test code here
 * });
 * ```
 */

/**
 * Extended test with automatic reporting hooks
 */
export const test = base;

// Add global beforeEach hook
test.beforeEach(async ({ page: _page }, testInfo: TestInfo) => {
  const testName = testInfo.title;
  console.log(`\n🚀 Starting test: ${testName}`);
  TestReportManager.getInstance().initializeTest(testName);
});

// Add global afterEach hook
test.afterEach(async ({ page: _page }, testInfo: TestInfo) => {
  const status =
    testInfo.status === "passed"
      ? "passed"
      : testInfo.status === "failed"
        ? "failed"
        : "skipped";

  await TestReportManager.getInstance().finalizeTest(status);
  console.log(
    `\n🏁 Test completed: ${testInfo.title} [${status.toUpperCase()}]`
  );
});

// Re-export expect for convenience
export { expect } from "@playwright/test";
