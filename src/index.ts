/**
 * Playwright E2E Framework
 *
 * A reusable Playwright-based E2E testing framework with:
 * - Page Object Model (POM) architecture
 * - Custom web element abstractions
 * - Comprehensive assertion logging
 * - Browser management utilities
 * - Cucumber BDD support
 *
 * @example
 * ```typescript
 * import {
 *   WebPage,
 *   WebElement,
 *   PwHelper,
 *   Environment,
 *   test,
 *   expect
 * } from 'playwright-e2e-framework';
 *
 * class LoginPage extends WebPage {
 *   usernameInput = new WebElement(this.page, '#username', 'Username Input');
 *   passwordInput = new WebElement(this.page, '#password', 'Password Input');
 *   loginButton = new WebElement(this.page, 'button[type="submit"]', 'Login Button');
 * }
 *
 * test('should login successfully', async ({ page }) => {
 *   const loginPage = new LoginPage(page);
 *   await loginPage.usernameInput.fill('user@example.com');
 *   await loginPage.passwordInput.fill('password123');
 *   await loginPage.loginButton.click();
 * });
 * ```
 */

// Core classes
export { FormPage } from "./Core/FormPage";
export { WebElement } from "./Core/WebElement";
export { WebPage } from "./Core/WebPage";

// Types and interfaces
export * from "./Types";

// Utility classes
export { AssertionLogger } from "./Utils/AssertionLogger";
export { BrowserManager } from "./Utils/BrowserManager";
export { Environment } from "./Utils/Environment";
export { PwHelper } from "./Utils/PwHelper";
export { TestReportManager } from "./Utils/TestReportManager";
export { WebHelper } from "./Utils/WebHelper";

// Test hooks and assertions
export { expect, test } from "./Utils/GlobalTestHooks";

// Factories
export { PageFactory, createPageObjects } from "./Factories/PageFactory";

// Cucumber support
export { CucumberWorld } from "./Support/CucumberWorld";
