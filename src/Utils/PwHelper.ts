import { Locator, Page } from "@playwright/test";
import { AssertionLogger } from "./AssertionLogger";
import { WebHelper } from "./WebHelper";

export class PwHelper {
  private defaultTimeout: number = 60000; // 1 minute
  private assertionLogger = AssertionLogger.getInstance();
  private currentReportPath: string = "reports";

  /**
   * Generic method to wait for a condition to be met using waitForFunction
   * @param page Playwright page instance
   * @param predicate Function to evaluate in browser context
   * @param args Arguments to pass to the predicate function
   * @param timeout Optional timeout in milliseconds
   * @param errorMessage Optional custom error message
   */
  private async waitForCondition<T>(
    page: Page,
    predicate: (arg: T) => boolean | Promise<boolean>,
    args: T,
    timeout: number = this.defaultTimeout,
    errorMessage?: string
  ): Promise<void> {
    try {
      await page.waitForFunction(
        ([predicateStr, arg]) => {
          // Recreate the predicate function in the browser context

          const pred = new Function("return " + predicateStr)();
          return pred(arg);
        },
        [predicate.toString(), args],
        { timeout }
      );
    } catch (error) {
      WebHelper.throwError(
        errorMessage || `Timeout waiting for condition: ${error}`
      );
    }
  }

  public async waitElementToLoad(
    page: Page,
    selector: string,
    identifier: string,
    timeout: number = this.defaultTimeout,
    elementIndex: number = 0
  ): Promise<void> {
    let isElementVisible = false;
    const seconds = timeout / 1000;
    WebHelper.logInfo(
      `Waiting for element "${identifier}" at index ${elementIndex} with timeout ${seconds}seconds...`
    );
    for (let i = 0; i < seconds; i++) {
      await page.waitForTimeout(1000);
      isElementVisible = await this.getElementVisibilityStatus(
        page,
        selector,
        identifier,
        elementIndex
      );
      if (isElementVisible) {
        WebHelper.logSuccess(
          `Element "${identifier}" at index ${elementIndex} loaded in ${i}seconds`
        );
        break;
      }
    }
    if (!isElementVisible) {
      WebHelper.throwError(
        `Element "${identifier}" at index ${elementIndex} not loaded in ${seconds}seconds`
      );
    }
  }

  public async waitElementToBeHidden(
    page: Page,
    selector: string,
    identifier: string,
    timeout: number = this.defaultTimeout,
    elementIndex: number = 0
  ): Promise<void> {
    let isElementVisible = true;
    const seconds = timeout / 1000;
    WebHelper.logInfo(
      `Waiting for element "${identifier}" at index ${elementIndex} with timeout ${seconds}seconds...`
    );
    for (let i = 0; i < seconds; i++) {
      await page.waitForTimeout(1000);
      isElementVisible = await this.getElementVisibilityStatus(
        page,
        selector,
        identifier,
        elementIndex
      );
      if (isElementVisible === false) {
        WebHelper.logSuccess(
          `Element "${identifier}" at index ${elementIndex} hidden in ${i}seconds`
        );
        break;
      }
    }
    if (isElementVisible === true) {
      WebHelper.throwError(
        `Element "${identifier}" at index ${elementIndex} is still visible in ${seconds}seconds`
      );
    }
  }

  public async simpleClick(
    page: Page,
    selector: string,
    identifier: string,
    elementIndex: number = 0
  ): Promise<void> {
    try {
      WebHelper.logInfo(
        `Attempting to click element "${identifier}" at index ${elementIndex}`
      );
      await this.waitElementToLoad(
        page,
        selector,
        identifier,
        60000,
        elementIndex
      );
      // Click the element at the specified index
      const elements = page.locator(selector);
      const count = await elements.count();
      if (count === 0) {
        WebHelper.throwError(`No elements found for selector "${selector}"`);
      }
      if (elementIndex >= count) {
        WebHelper.throwError(
          `Element index ${elementIndex} is out of bounds. Found ${count} elements.`
        );
      }
      await elements.nth(elementIndex).click();
      WebHelper.logSuccess(`Successfully clicked element "${identifier}"`);
    } catch (error) {
      WebHelper.throwError(`Failed to click element ${identifier}: ${error}`);
    }
    WebHelper.logInfo(
      `Successfully clicked element "${identifier} at index ${elementIndex}"`
    );
  }

  public async clickIfVisible(
    page: Page,
    selector: string,
    identifier: string,
    index: number = 0,
    timeout: number = this.defaultTimeout
  ): Promise<void> {
    WebHelper.logInfo(
      `Attempting to click element "${identifier}" at index ${index} if visible with timeout ${timeout}ms`
    );
    try {
      const isVisible = await this.getElementVisibilityStatus(
        page,
        selector,
        identifier,
        index
      );
      if (isVisible) {
        await page.locator(selector).nth(index).click();
        WebHelper.logSuccess(
          `Successfully clicked element "${identifier}" at index ${index}`
        );
      } else {
        WebHelper.logInfo(
          `Element "${identifier}" at index ${index} not visible in ${timeout}ms`
        );
      }
    } catch (error) {
      WebHelper.logWarning(`Failed to click element ${identifier}: ${error}`);
    }
  }

  public async forcedClick(
    page: Page,
    selector: string,
    identifier: string
  ): Promise<void> {
    try {
      WebHelper.logInfo(`Attempting to force click element "${identifier}"`);
      await this.waitElementToLoad(page, selector, identifier);
      // 🎯 Fixed: Always click the first element when multiple elements are found
      await page.click(selector, { force: true, strict: false });
      WebHelper.logSuccess(
        `Successfully force clicked element "${identifier}"`
      );
    } catch (error) {
      WebHelper.throwError(
        `Failed to Force click element ${identifier}: ${error}`
      );
    }
    WebHelper.logInfo(`Successfully force clicked element "${identifier}"`);
  }

  public async delayedSimpleClick(
    page: Page,
    selector: string,
    identifier: string,
    delay: number = 1000
  ): Promise<void> {
    try {
      WebHelper.logInfo(
        `Attempting delayed click on element "${identifier}" with delay ${delay}ms`
      );
      await page.waitForTimeout(delay);
      await this.waitElementToLoad(page, selector, identifier);
      // 🎯 Fixed: Always click the first element when multiple elements are found
      await page.click(selector, { strict: false });
      WebHelper.logSuccess(
        `Successfully delayed clicked element "${identifier}"`
      );
    } catch (error) {
      WebHelper.throwError(
        `Failed to delayed click element ${identifier}: ${error}`
      );
    }
    WebHelper.logInfo(`Successfully delayed clicked element "${identifier}"`);
  }

  // 🎯 New method: Click on specific positioned element when multiple elements exist
  public async clickWhenMultipleElements(
    page: Page,
    selector: string,
    identifier: string,
    elementPosition: number = 0
  ): Promise<void> {
    try {
      WebHelper.logInfo(
        `Attempting to click element "${identifier}" at position ${elementPosition}`
      );
      await this.waitElementToLoad(page, selector, identifier);
      // Get all elements and click the one at the specified position
      const elements = await page.locator(selector).all();
      if (elements.length === 0) {
        WebHelper.throwError(`No elements found for selector: ${selector}`);
      }
      if (elementPosition >= elements.length) {
        WebHelper.throwError(
          `Element position ${elementPosition} is out of bounds. Found ${elements.length} elements.`
        );
      }
      const element = elements[elementPosition];
      if (!element) {
        WebHelper.throwError(`Element at position ${elementPosition} is undefined`);
        return;
      }
      await element.click();
      WebHelper.logSuccess(
        `Successfully clicked element "${identifier}" at position ${elementPosition}`
      );
    } catch (error) {
      WebHelper.throwError(
        `Failed to click element at position ${elementPosition} for ${identifier}: ${error}`
      );
    }
    WebHelper.logInfo(
      `Successfully clicked element "${identifier}" at position ${elementPosition}`
    );
  }

  public async inputText(
    page: Page,
    selector: string,
    identifier: string,
    text: string,
    elementIndex: number = 0
  ): Promise<void> {
    try {
      WebHelper.logInfo(
        `Attempting to input text "${text}" into element "${identifier}" at index ${elementIndex}`
      );
      await this.waitElementToLoad(
        page,
        selector,
        identifier,
        this.defaultTimeout,
        elementIndex
      );
      //Find the element at the specified index
      const elements = page.locator(selector);
      await elements.nth(elementIndex).fill(text);
      WebHelper.logSuccess(
        `Successfully input text into element "${identifier}"`
      );
    } catch (error) {
      WebHelper.throwError(
        `Failed to input text in element ${identifier}: ${error}`
      );
    }
  }

  /***
   * This function type secret text without showing the text in the input field
   */
  public async inputSecretText(
    page: Page,
    selector: string,
    identifier: string,
    secretText: string,
    elementIndex: number = 0
  ): Promise<void> {
    try {
      WebHelper.logInfo(
        `Attempting to input secret text "********" into element "${identifier}" at index ${elementIndex}`
      );
      await this.waitElementToLoad(
        page,
        selector,
        identifier,
        this.defaultTimeout,
        elementIndex
      );
      //Find the element at the specified index
      const elements = page.locator(selector);
      await elements.nth(elementIndex).fill(secretText);
      WebHelper.logSuccess(
        `Successfully input secret text into element "${identifier}"`
      );
    } catch (error) {
      WebHelper.throwError(
        `Failed to input secret text in element ${identifier}: ${error}`
      );
    }
  }

  public async assertElementText(
    page: Page,
    selector: string,
    identifier: string,
    expectedText: string,
    elementIndex: number = 0
  ): Promise<void> {
    const startTime = Date.now();

    try {
      WebHelper.logInfo(
        `Asserting text content for element "${identifier}". Expected: "${expectedText}"`
      );
      await this.waitElementToLoad(page, selector, identifier);
      const elements = page.locator(selector);
      const count = await elements.count();

      if (count === 0) {
        WebHelper.throwError(`No elements found for selector "${selector}"`);
      }

      if (elementIndex >= count) {
        WebHelper.throwError(
          `Element index ${elementIndex} is out of bounds. Found ${count} elements.`
        );
      }

      const rawText = await elements.nth(elementIndex).textContent();

      // Use the same text formatting as Cypress to ensure consistency
      const actualText = WebHelper.formatText(rawText || "");
      const formattedExpectedText = WebHelper.formatText(expectedText);

      if (!actualText.includes(formattedExpectedText)) {
        WebHelper.logError(
          `Text assertion failed for ${identifier}. Expected text "${formattedExpectedText}" not found in actual text "${actualText}"`
        );
        // Log failed text assertion
        await this.assertionLogger.logAssertion(
          {
            elementIdentifier: identifier,
            assertionType: "TEXT_CONTENT",
            status: "FAILED",
            message: "Text content does NOT match expected value",
            selector,
            expectedValue: formattedExpectedText,
            actualValue: actualText,
            duration: Date.now() - startTime,
          },
          page,
          true
        ); // Take screenshot on failure

        WebHelper.throwError(
          `Text assertion failed for ${identifier}. Expected text "${formattedExpectedText}" not found in actual text "${actualText}"`
        );
      }

      WebHelper.logSuccess(`Text assertion passed for element "${identifier}"`);
      // Log successful text assertion
      await this.assertionLogger.logAssertion({
        elementIdentifier: identifier,
        assertionType: "TEXT_CONTENT",
        status: "PASSED",
        message: "Text content matches expected value",
        selector,
        expectedValue: formattedExpectedText,
        actualValue: actualText,
        duration: Date.now() - startTime,
      });
    } catch (error) {
      // If error is not from text mismatch, log as general failure
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      if (!errorMessage.includes("Text assertion failed")) {
        WebHelper.logError(
          `Failed to assert text for element ${identifier}: ${errorMessage}`
        );
        await this.assertionLogger.logAssertion(
          {
            elementIdentifier: identifier,
            assertionType: "TEXT_CONTENT",
            status: "FAILED",
            message: "Failed to retrieve or compare text content",
            selector,
            expectedValue: expectedText,
            duration: Date.now() - startTime,
          },
          page,
          true
        );
      }
      WebHelper.throwError(
        `Failed to assert text for element ${identifier}: ${errorMessage}`
      );
    }
  }

  public async assertElementTextContains(
    page: Page,
    selector: string,
    identifier: string,
    expectedText: string,
    elementIndex: number = 0
  ): Promise<void> {
    try {
      WebHelper.logInfo(
        `Checking if the element "${identifier.toUpperCase()}" contains the expected text "${expectedText.toUpperCase()}"`
      );
      await this.waitElementToLoad(
        page,
        selector,
        identifier,
        this.defaultTimeout,
        elementIndex
      );
      const rawText = await page
        .locator(selector)
        .nth(elementIndex)
        .textContent();
      const actualText = WebHelper.formatText(rawText || "");

      WebHelper.assert(
        actualText.toUpperCase().includes(expectedText.toUpperCase().trim()),
        `Text Assertion passed for "${expectedText.toUpperCase().trim()}" for the element "${identifier.toUpperCase()}"`,
        `Text Assertion failed for "${expectedText.toUpperCase().trim()}" for the element "${identifier.toUpperCase()}". \n The expected text "${expectedText.toUpperCase().trim()}" was not found in the actual text "${actualText.toUpperCase()}"`
      );
    } catch (error) {
      WebHelper.throwError(
        `Failed to assert text for element ${identifier}: ${error}`
      );
    }
  }

  public async runWhenElementPresenceIs(
    page: Page,
    selector: string,
    identifier: string,
    state: boolean,
    method: () => Promise<void>
  ): Promise<void> {
    try {
      WebHelper.logInfo(
        `Checking element presence for "${identifier}". Expected presence: ${state}`
      );
      const elements = await page.locator(selector).count();
      const isPresent = elements > 0;
      if (isPresent === state) {
        WebHelper.logSuccess(
          `Element presence check passed for "${identifier}"`
        );
        await method();
      } else {
        WebHelper.logInfo(
          `Element presence check condition not met for "${identifier}"`
        );
      }
    } catch (error) {
      WebHelper.logError(
        `Error checking element presence for ${identifier}: ${error}`
      );
      this.logMessage(
        `Error checking element presence for ${identifier}: ${error}`
      );
    }
  }

  public async navigateToUrl(page: Page, url: string): Promise<void> {
    try {
      WebHelper.logInfo(`Navigating to URL: ${url}`);
      await page.goto(url);
      WebHelper.logSuccess(`Successfully navigated to URL: ${url}`);
    } catch (error) {
      WebHelper.throwError(
        `Failed to navigate to URL: ${url}. Error: ${error}`
      );
    }
  }

  public async logMessage(message: string): Promise<void> {
    // eslint-disable-next-line no-console
    console.log(message);
    return Promise.resolve();
  }

  /**
   * 📂 Set custom report paths for organized folder structure
   */
  public setReportPaths(reportPath: string): void {
    this.currentReportPath = reportPath;
    this.assertionLogger.setReportPaths(reportPath);
  }

  /**
   * 📊 Generate and print assertion summary report with organized paths
   */
  public async generateAssertionSummary(reportPath?: string): Promise<void> {
    this.assertionLogger.printSummaryReport();
    const targetPath = reportPath || this.currentReportPath;
    const reportFile = this.assertionLogger.exportSummaryToJson(
      "assertion-report.json",
      targetPath
    );
    this.logMessage(`📊 Detailed assertion report exported to: ${reportFile}`);
  }

  /**
   * 🔄 Reset assertion logger for new test run
   * Call this at the beginning of tests
   */
  public resetAssertionLogger(): void {
    AssertionLogger.reset();
    this.assertionLogger = AssertionLogger.getInstance();
    this.logMessage("🔄 Assertion logger reset for new test run");
  }

  /**
   * 📈 Check if all assertions passed
   */
  public allAssertionsPassed(): boolean {
    return this.assertionLogger.allAssertionsPassed();
  }

  /**
   * 📋 Get failed assertions for error handling
   */
  public getFailedAssertions(): any[] {
    return this.assertionLogger.getFailedResults();
  }

  /**
   * 📊 Get assertion summary data
   */
  public getAssertionSummary(): any {
    return this.assertionLogger.generateSummary();
  }

  // Additional Playwright-specific methods
  public static async clearAndType(
    page: Page,
    selector: string,
    text: string
  ): Promise<void> {
    await page.fill(selector, "");
    await page.fill(selector, text);
  }

  public static async selectByVisibleText(
    page: Page,
    selector: string,
    text: string
  ): Promise<void> {
    await page.selectOption(selector, { label: text });
  }

  public static async selectByValue(
    page: Page,
    selector: string,
    value: string
  ): Promise<void> {
    await page.selectOption(selector, { value: value });
  }

  public static async selectByIndex(
    page: Page,
    selector: string,
    index: number
  ): Promise<void> {
    await page.selectOption(selector, { index: index });
  }

  public static async checkElement(
    page: Page,
    selector: string
  ): Promise<void> {
    await page.check(selector);
  }

  public static async uncheckElement(
    page: Page,
    selector: string
  ): Promise<void> {
    await page.uncheck(selector);
  }

  public static async getElementText(
    page: Page,
    selector: string
  ): Promise<string | null> {
    return await page.locator(selector).textContent();
  }

  public static async getElementAttribute(
    page: Page,
    selector: string,
    attribute: string
  ): Promise<string | null> {
    return await page.locator(selector).getAttribute(attribute);
  }

  public static async isElementVisible(
    page: Page,
    selector: string
  ): Promise<boolean> {
    return await page.locator(selector).isVisible();
  }

  public static async scrollToElement(
    page: Page,
    selector: string
  ): Promise<void> {
    await page.locator(selector).scrollIntoViewIfNeeded();
  }

  public static async dragAndDrop(
    page: Page,
    sourceSelector: string,
    targetSelector: string
  ): Promise<void> {
    await page.dragAndDrop(sourceSelector, targetSelector);
  }

  public static async uploadFile(
    page: Page,
    selector: string,
    filePath: string
  ): Promise<void> {
    await page.locator(selector).setInputFiles(filePath);
  }

  public static async doubleClick(page: Page, selector: string): Promise<void> {
    await page.dblclick(selector);
    WebHelper.logInfo(`Successfully double clicked element "${selector}"`);
  }

  public static async rightClick(page: Page, selector: string): Promise<void> {
    await page.click(selector, { button: "right" });
    WebHelper.logInfo(`Successfully right clicked element "${selector}"`);
  }

  public static async hover(page: Page, selector: string): Promise<void> {
    await page.hover(selector);
    WebHelper.logInfo(`Successfully hovered element "${selector}"`);
  }

  public static async getElementsQuantity(
    page: Page,
    selector: string,
    identifier: string
  ): Promise<number> {
    const elements = await page.locator(selector).count();
    WebHelper.logMessage(`Found ${elements} elements for ${identifier}`);
    return elements;
  }

  // Instance method required by ITestHelper interface
  public async getElementsQuantity(
    page: Page,
    selector: string,
    identifier: string
  ): Promise<number> {
    const count = await page.locator(selector).count();
    WebHelper.logMessage(`Found ${count} elements for ${identifier}`);
    return count;
  }

  /**
   * 🔐 HTTP Basic Authentication - Navigate to URL with authentication for Playwright
   * @param page The Playwright page instance
   * @param url The URL that requires basic authentication
   * @param username Username for authentication
   * @param password Password for authentication
   */
  public static async authenticateWithBasicAuth(
    page: Page,
    url: string,
    username: string,
    password: string
  ): Promise<void> {
    // Set HTTP Basic Authentication credentials for the context
    const context = page.context();
    await context.setHTTPCredentials({
      username: username,
      password: password,
    });

    // Navigate to the URL
    await page.goto(url);
  }

  /**
   * 🔐 Handle Browser Authentication Alert - Alternative approach for Playwright
   * @param page The Playwright page instance
   * @param url The URL that requires basic authentication
   * @param username Username for authentication
   * @param password Password for authentication
   */
  public static async handleAuthenticationAlert(
    page: Page,
    url: string,
    username: string,
    password: string
  ): Promise<void> {
    // Set authentication for the entire context
    await page.context().setHTTPCredentials({
      username: username,
      password: password,
    });

    // Navigate to the protected URL
    await page.goto(url);
  }

  public async assertElementVisibility(
    page: Page,
    selector: string,
    identifier: string,
    visibility: boolean,
    elementIndex: number = 0
  ): Promise<void> {
    const startTime = Date.now();

    try {
      WebHelper.logInfo(
        `Asserting element visibility for "${identifier}". Expected visibility: ${visibility}`
      );
      if (visibility) {
        // Wait for specific element to be visible
        const elements = page.locator(selector);
        const count = await elements.count();

        if (count === 0) {
          WebHelper.throwError(`No elements found for selector "${selector}"`);
        }

        if (elementIndex >= count) {
          WebHelper.throwError(
            `Element index ${elementIndex} is out of bounds. Found ${count} elements.`
          );
        }

        // Wait for element to be visible using waitForCondition
        await this.waitForCondition(
          page,
          ({ selector, index }: { selector: string; index: number }): boolean => {
            const elements = document.querySelectorAll(selector);
            if (elements.length <= index) {
              return false;
            }
            const element = elements[index];
            if (!element) {
              return false;
            }
            const style = window.getComputedStyle(element as unknown as Element);
            return (
              style.display !== "none" &&
              style.visibility !== "hidden" &&
              style.opacity !== "0"
            );
          },
          { selector, index: elementIndex },
          this.defaultTimeout,
          `Element "${identifier}" at index ${elementIndex} is not visible`
        );

        WebHelper.logSuccess(
          `Element "${identifier}" visibility check passed: ${visibility}`
        );
        await this.logMessage(
          `Element "${identifier}" visibility check passed: ${visibility}`
        );

        // Log successful assertion
        await this.assertionLogger.logAssertion({
          elementIdentifier: identifier,
          assertionType: "ELEMENT_PRESENCE",
          status: "PASSED",
          message: "Element is visible and present on the page",
          selector,
          duration: Date.now() - startTime,
        });
      } else {
        // Wait for element to be hidden or removed using waitForCondition
        await this.waitForCondition(
          page,
          ({ selector, index }) => {
            const elements = document.querySelectorAll(selector);
            if (elements.length <= index) {
              return true;
            } // Element is removed
            const element = elements[index];
            const style = window.getComputedStyle(element as unknown as Element);
            return (
              !element ||
              style.display === "none" ||
              style.visibility === "hidden" ||
              style.opacity === "0"
            );
          },
          { selector, index: elementIndex },
          this.defaultTimeout,
          `Element "${identifier}" at index ${elementIndex} is still visible`
        );

        WebHelper.logSuccess(
          `Element "${identifier}" visibility check passed: ${visibility}`
        );
        await this.logMessage(
          `Element "${identifier}" visibility check passed: ${visibility}`
        );

        // Log successful assertion
        await this.assertionLogger.logAssertion({
          elementIdentifier: identifier,
          assertionType: "ELEMENT_ABSENCE",
          status: "PASSED",
          message: "Element is not visible as expected",
          selector,
          duration: Date.now() - startTime,
        });
      }
    } catch (error) {
      WebHelper.logError(
        `Failed to assert visibility for element ${identifier}: ${error}`
      );
      // Log failed assertion
      await this.assertionLogger.logAssertion(
        {
          elementIdentifier: identifier,
          assertionType: visibility ? "ELEMENT_PRESENCE" : "ELEMENT_ABSENCE",
          status: "FAILED",
          message: visibility
            ? "Element is NOT visible or present on the page"
            : "Element is still visible when it should be hidden",
          selector,
          duration: Date.now() - startTime,
        },
        page,
        true
      ); // Take screenshot on failure

      WebHelper.throwError(
        `Failed to assert visibility for element ${identifier}: ${error}`
      );
    }
  }

  public async assertElementImageIsValid(
    page: Page,
    selector: string,
    identifier: string,
    elementIndex: number = 0
  ): Promise<void> {
    try {
      WebHelper.logInfo(`Checking image validity for element "${identifier}"`);
      await this.waitElementToLoad(
        page,
        selector,
        identifier,
        this.defaultTimeout,
        elementIndex
      );

      // Use evaluate to check image properties in the browser context
      const imageStatus = await page
        .locator(selector)
        .nth(elementIndex)
        .evaluate((img: HTMLImageElement) => {
          return {
            naturalWidth: img.naturalWidth,
            naturalHeight: img.naturalHeight,
            complete: img.complete,
            src: img.src,
          };
        });

      const isValid =
        imageStatus.naturalWidth > 0 &&
        imageStatus.naturalHeight > 0 &&
        imageStatus.complete;

      if (isValid) {
        WebHelper.logSuccess(
          `Image "${identifier}" is valid (${imageStatus.naturalWidth}x${imageStatus.naturalHeight})`
        );
        await this.logMessage(
          `Image "${identifier}" is valid (${imageStatus.naturalWidth}x${imageStatus.naturalHeight})`
        );
      } else {
        WebHelper.logError(
          `Image "${identifier}" is broken - naturalWidth: ${imageStatus.naturalWidth}, naturalHeight: ${imageStatus.naturalHeight}, complete: ${imageStatus.complete}`
        );
        await this.logMessage(
          `Image "${identifier}" is broken - naturalWidth: ${imageStatus.naturalWidth}, naturalHeight: ${imageStatus.naturalHeight}, complete: ${imageStatus.complete}`
        );
      }
    } catch (error) {
      WebHelper.logError(`Failed to check image ${identifier}: ${error}`);
      await this.logMessage(`Failed to check image ${identifier}: ${error}`);
    }
  }

  public async assertElementIsChecked(
    page: Page,
    selector: string,
    identifier: string,
    elementIndex: number = 0
  ): Promise<void> {
    try {
      WebHelper.logInfo(`Asserting element is checked for "${identifier}"`);
      await this.waitForCondition(
        page,
        ({ selector, index }) => {
          const elements = document.querySelectorAll(selector);
          return (
            elements.length > index &&
            (elements[index] as HTMLInputElement).checked === true
          );
        },
        { selector, index: elementIndex },
        this.defaultTimeout,
        `Element "${identifier}" at index ${elementIndex} is not checked`
      );
      WebHelper.logSuccess(`Element "${identifier}" is checked as expected`);
    } catch (error) {
      WebHelper.logError(
        `Failed to assert element is checked for ${identifier}: ${error}`
      );
      throw error;
    }
  }

  public async assertElementIsNotChecked(
    page: Page,
    selector: string,
    identifier: string,
    elementIndex: number = 0
  ): Promise<void> {
    try {
      WebHelper.logInfo(`Asserting element is not checked for "${identifier}"`);
      await this.waitForCondition(
        page,
        ({ selector, index }) => {
          const elements = document.querySelectorAll(selector);
          return (
            elements.length > index &&
            (elements[index] as HTMLInputElement).checked === false
          );
        },
        { selector, index: elementIndex },
        this.defaultTimeout,
        `Element "${identifier}" at index ${elementIndex} is checked`
      );
      WebHelper.logSuccess(
        `Element "${identifier}" is not checked as expected`
      );
    } catch (error) {
      WebHelper.logError(
        `Failed to assert element is not checked for ${identifier}: ${error}`
      );
      throw error;
    }
  }

  public async getCheckedState(
    page: Page,
    selector: string,
    identifier: string,
    elementIndex: number = 0
  ): Promise<boolean> {
    try {
      WebHelper.logInfo(`Getting checked state for element "${identifier}"`);
      await this.waitForCondition(
        page,
        ({ selector, index }) => {
          const elements = document.querySelectorAll(selector);
          return elements.length > index;
        },
        { selector, index: elementIndex },
        this.defaultTimeout,
        `Element "${identifier}" at index ${elementIndex} not found`
      );

      const checkedState = await page.evaluate(
        ({ selector, index }) => {
          const element = document.querySelectorAll(selector)[
            index
          ] as HTMLInputElement;
          return element.checked;
        },
        { selector, index: elementIndex }
      );

      WebHelper.logSuccess(
        `Retrieved checked state for element "${identifier}": ${checkedState}`
      );
      return checkedState;
    } catch (error) {
      WebHelper.throwError(
        `Failed to get checked state for element "${identifier}": ${error}`
      );
    }
  }

  public async selectOption(
    page: Page,
    selector: string,
    identifier: string,
    optionPosition: number,
    elementIndex: number = 0
  ): Promise<void> {
    try {
      WebHelper.logInfo(
        `Selecting option at position ${optionPosition} for element "${identifier}"`
      );
      const elements = page.locator(selector);
      const count = await elements.count();

      if (count === 0) {
        WebHelper.throwError(`No elements found for selector "${selector}"`);
      }

      if (elementIndex >= count) {
        WebHelper.throwError(
          `Element index ${elementIndex} is out of bounds. Found ${count} elements.`
        );
      }

      await elements.nth(elementIndex).selectOption({ index: optionPosition });
      WebHelper.logSuccess(
        `Successfully selected option for element "${identifier}"`
      );
    } catch (error) {
      WebHelper.logError(
        `Failed to select option for element ${identifier}: ${error}`
      );
      throw error;
    }
  }

  public async sendAPIRequest(
    url: string,
    method: string,
    body?: any
  ): Promise<any> {
    try {
      WebHelper.logInfo(`Sending API request: ${method} ${url}`);
      const requestOptions: any = {
        method: method,
        headers: {
          "Content-Type": "application/json",
        },
      };

      // Only add body if it's provided and method supports it
      if (body !== undefined && method !== "GET") {
        requestOptions.body = JSON.stringify(body);
      }

      const response = await fetch(url, requestOptions);
      const responseData = await response.json();

      WebHelper.logSuccess(
        `API request successful: ${response.status} ${response.statusText}`
      );
      return {
        status: response.status,
        statusText: response.statusText,
        body: responseData,
        headers: response.headers,
      };
    } catch (error) {
      WebHelper.throwError(`API request failed: ${error}`);
    }
  }

  public async sendKEnterKey(page: Page, selector: string): Promise<void> {
    try {
      WebHelper.logInfo(
        `Sending Enter key to element with selector: ${selector}`
      );
      await page.locator(selector).press("Enter");
      WebHelper.logSuccess(`Successfully sent Enter key to element`);
    } catch (error) {
      WebHelper.throwError(`Failed to send Enter key to element: ${error}`);
      throw error;
    }
  }

  public async assertImageIsVisible(
    page: Page,
    selector: string,
    imageName: string,
    timeout: number = 60000 // 5 minutes
  ): Promise<void> {
    try {
      WebHelper.logInfo(`Asserting image visibility for "${imageName}"`);
      await page
        .locator(selector)
        .waitFor({ state: "visible", timeout: timeout });
      WebHelper.logSuccess(`Image "${imageName}" is visible`);
      await this.logMessage(`Image "${imageName}" is visible`);
    } catch (error) {
      WebHelper.logError(
        `Failed to assert image visibility for "${imageName}": ${error}`
      );
      throw error;
    }
  }

  public async assertImageIsNotVisible(
    page: Page,
    selector: string,
    imageName: string,
    timeout: number = 60000 // 5 minutes
  ): Promise<void> {
    try {
      WebHelper.logInfo(`Asserting image is not visible for "${imageName}"`);
      await page
        .locator(selector)
        .waitFor({ state: "hidden", timeout: timeout });
      WebHelper.logSuccess(`Image "${imageName}" is not visible`);
      await this.logMessage(`Image "${imageName}" is not visible`);
    } catch (error) {
      WebHelper.logError(
        `Failed to assert image is not visible for "${imageName}": ${error}`
      );
      throw error;
    }
  }

  public async assertImageNameAttribute(
    page: Page,
    selector: string,
    imageName: string
  ): Promise<void> {
    try {
      WebHelper.logInfo(`Asserting image name attribute for "${imageName}"`);
      const attribute = await page.locator(selector).getAttribute("src");
      if (attribute !== imageName) {
        WebHelper.throwError(`Image "${imageName}" attribute is not correct`);
      } else {
        WebHelper.logSuccess(`Image "${imageName}" attribute is correct`);
        await this.logMessage(`Image "${imageName}" attribute is correct`);
      }
    } catch (error) {
      WebHelper.logError(
        `Failed to assert image name attribute for "${imageName}": ${error}`
      );
      throw error;
    }
  }

  public async assertRadioItemIsSelected(
    page: Page,
    selector: string,
    identifier: string
  ): Promise<void> {
    try {
      WebHelper.logInfo(`Asserting radio item is selected for "${identifier}"`);
      const isSelected = await page.locator(selector).isChecked();
      if (!isSelected) {
        WebHelper.throwError(`Radio item "${identifier}" is not selected`);
      }
      WebHelper.logSuccess(
        `Radio item "${identifier}" is selected as expected`
      );
    } catch (error) {
      WebHelper.throwError(
        `Failed to assert radio item is selected for "${identifier}": ${error}`
      );
      throw error;
    }
  }

  public async assertRadioItemIsNotSelected(
    page: Page,
    selector: string,
    identifier: string
  ): Promise<void> {
    try {
      WebHelper.logInfo(
        `Asserting radio item is not selected for "${identifier}"`
      );
      const isSelected = await page.locator(selector).isChecked();
      if (isSelected) {
        WebHelper.throwError(`Radio item "${identifier}" is selected`);
      }
      WebHelper.logSuccess(
        `Radio item "${identifier}" is not selected as expected`
      );
    } catch (error) {
      WebHelper.throwError(
        `Failed to assert radio item is not selected for "${identifier}": ${error}`
      );
      throw error;
    }
  }

  public async getElementQuantity(
    page: Page,
    selector: string,
    identifier: string
  ): Promise<number> {
    try {
      WebHelper.logInfo(`Getting element quantity for "${identifier}"`);
      const count = await page.locator(selector).count();
      WebHelper.logSuccess(`Found ${count} elements for ${identifier}`);
      await this.logMessage(`Found ${count} elements for ${identifier}`);
      return count;
    } catch (error) {
      WebHelper.logError(
        `Failed to get element quantity for "${identifier}": ${error}`
      );
      throw error;
    }
  }

  public async getElementVisibilityStatus(
    page: Page,
    selector: string,
    identifier: string,
    index: number = 0
  ): Promise<boolean> {
    try {
      WebHelper.logInfo(
        `Getting element visibility status for selector: ${selector} at index ${index} for "${identifier}"`
      );
      const isVisible = await page.locator(selector).nth(index).isVisible();
      WebHelper.logSuccess(
        `Element visibility status: ${isVisible} for "${identifier}"`
      );
      return isVisible;
    } catch (error) {
      WebHelper.logError(
        `Failed to get element visibility status: ${error} for "${identifier}"`
      );
      throw error;
    }
  }

  public async getInternalText(
    page: Page,
    selector: string,
    position: number = 0,
    timeout: number = 60000
  ): Promise<string> {
    try {
      WebHelper.logInfo(
        `Getting internal text for selector: ${selector} at position ${position}`
      );
      const text = await page
        .locator(selector)
        .nth(position)
        .textContent({ timeout });
      if (text === null) {
        WebHelper.logInfo(`No text content found for element`);
        return "";
      }
      WebHelper.logSuccess(`Retrieved text content: "${text}"`);
      return text;
    } catch (error) {
      WebHelper.logError(`Failed to get internal text: ${error}`);
      throw error;
    }
  }

  public async getInputText(
    page: Page,
    selector: string,
    position: number = 0
  ): Promise<string> {
    try {
      WebHelper.logInfo(
        `Getting input text for selector: ${selector} at position ${position}`
      );
      const text = await page.locator(selector).nth(position).inputValue();
      WebHelper.logSuccess(`Retrieved input text: "${text}"`);
      return text;
    } catch (error) {
      WebHelper.logError(`Failed to get input text: ${error}`);
      throw error;
    }
  }

  public async waitForText(
    page: Page,
    selector: string,
    text: string,
    timeout: number = 60000 // 5 minutes
  ): Promise<void> {
    try {
      WebHelper.logInfo(
        `Waiting for text "${text}" in element with selector: ${selector}`
      );
      // First wait for element to be visible
      await page.locator(selector).waitFor({ state: "visible", timeout });

      // Then wait for the text to match
      await this.waitForCondition(
        page,
        ({ selector, expectedText }) => {
          const element = document.querySelector(selector);
          return !!element && element.textContent === expectedText;
        },
        { selector, expectedText: text },
        timeout,
        `Timeout waiting for text "${text}" in element "${selector}"`
      );
      WebHelper.logSuccess(
        `Text "${text}" is present in element with selector "${selector}"`
      );
    } catch (error) {
      WebHelper.logError(
        `Failed waiting for text "${text}" in element "${selector}": ${error}`
      );
    }
  }

  public async waitForElementTextToBeEqualTo(
    page: Page,
    selector: string,
    text: string,
    timeout: number = 60000, // 1 minute (60 seconds)
    index: number = 0
  ): Promise<void> {
    WebHelper.logInfo(
      `Waiting for text "${text}" in element with selector: ${selector}`
    );
    // First wait for element to be visible
    await page
      .locator(selector)
      .nth(index)
      .waitFor({ state: "visible", timeout });

    const pollingInterval = 100;
    let elapsedTime = 0;

    while (elapsedTime < timeout) {
      const actualText = await page
        .locator(selector)
        .nth(index)
        .textContent({ timeout: 100 });
      if (
        actualText &&
        actualText.toUpperCase().trim() === text.toUpperCase().trim()
      ) {
        WebHelper.logSuccess(
          `Text "${text}" is present in element "${selector}"`
        );
        return;
      }
      await page.waitForTimeout(pollingInterval);
      elapsedTime += pollingInterval;
    }

    WebHelper.throwError(
      `Text "${text}" is not present in element "${selector}" after ${timeout / 1000} seconds`
    );
  }

  public async assertPropertyValue(
    page: Page,
    selector: string,
    identifier: string,
    property: string,
    value: string,
    index: number = 0
  ): Promise<void> {
    try {
      WebHelper.logInfo(
        `Asserting property value for element "${identifier}". Property: "${property}", Expected: "${value}"`
      );
      // First wait for the element to be present
      const element = page.locator(selector).nth(index);
      await element.waitFor({ state: "attached", timeout: 60000 });

      // Then wait for the attribute to have the expected value
      await element.waitFor({
        state: "attached",
        timeout: 60000, // 5 minutes
      });

      const propertyValue = await element.getAttribute(property);
      if (propertyValue && propertyValue.includes(value)) {
        WebHelper.logSuccess(
          `Property "${property}" value assertion passed for element "${identifier}"`
        );
        await this.logMessage(
          `The value "${value}" for the property "${property}" is present in the element "${identifier}"`
        );
      } else {
        WebHelper.throwError(
          `Property "${property}" value is not correct, expected "${value}" but got "${propertyValue}" for element "${identifier}"`
        );
      }
    } catch (error) {
      const element = page.locator(selector).nth(index);
      const actualValue = await element.getAttribute(property);
      WebHelper.throwError(
        `Property "${property}" value is not correct, expected "${value}" but got "${actualValue}" for element "${identifier}" + ${error}`
      );
    }
  }

  public async isElementPresent(
    page: Page,
    selector: string
  ): Promise<boolean> {
    try {
      WebHelper.logInfo(`Checking element presence for selector: ${selector}`);
      const elements = await page.locator(selector).count();
      const isPresent = elements > 0;
      WebHelper.logSuccess(`Element presence check: ${isPresent}`);
      return isPresent;
    } catch (error) {
      WebHelper.logError(`Failed to check element presence: ${error}`);
      throw error;
    }
  }

  public async assertElementNotExists(
    page: Page,
    selector: string,
    identifier: string
  ): Promise<void> {
    try {
      WebHelper.logInfo(`Asserting element does not exist for "${identifier}"`);
      const elements = await page.locator(selector).count();
      if (elements > 0) {
        WebHelper.throwError(`Element "${identifier}" still exists`);
      } else {
        WebHelper.logSuccess(
          `Element "${identifier}" does not exist as expected`
        );
        await this.logMessage(` Element "${identifier}" does not exist`);
      }
    } catch (error) {
      WebHelper.throwError(
        `Failed to assert element does not exist for "${identifier}": ${error}`
      );
      throw error;
    }
  }

  public async hover(page: Page, selector: string): Promise<void> {
    try {
      WebHelper.logInfo(`Hovering over element with selector: ${selector}`);
      await page.hover(selector);
      WebHelper.logSuccess(`Successfully hovered over element`);
    } catch (error) {
      WebHelper.logError(`Failed to hover over element: ${error}`);
      throw error;
    }
  }

  public async getHoverText(page: Page, selector: string): Promise<string> {
    try {
      WebHelper.logInfo(`Getting hover text for selector: ${selector}`);
      const text = await page.locator(selector).textContent();
      if (text === null) {
        WebHelper.logInfo(`No hover text found for element`);
        return "";
      }
      WebHelper.logSuccess(`Retrieved hover text: "${text}"`);
      return text;
    } catch (error) {
      WebHelper.logError(`Failed to get hover text: ${error}`);
      throw error;
    }
  }

  public async getPlaceholderText(
    page: Page,
    selector: string
  ): Promise<string> {
    try {
      WebHelper.logInfo(`Getting placeholder text for selector: ${selector}`);
      const text = await page.locator(selector).getAttribute("placeholder");
      if (text === null) {
        WebHelper.logInfo(`No placeholder text found for element`);
        return "";
      }
      WebHelper.logSuccess(`Retrieved placeholder text: "${text}"`);
      return text;
    } catch (error) {
      WebHelper.logError(`Failed to get placeholder text: ${error}`);
      throw error;
    }
  }

  public async assertElementHasProperty(
    page: Page,
    selector: string,
    property: string,
    index: number = 0
  ): Promise<void> {
    try {
      WebHelper.logInfo(
        `Asserting element has property "${property}" for selector: ${selector}`
      );
      const element = page.locator(selector).nth(index);
      const propertyValue = await element.getAttribute(property);
      if (propertyValue === null) {
        WebHelper.throwError(
          `Property "${property}" is not present in the element. And it should be!`
        );
      } else {
        WebHelper.logSuccess(
          ` Property "${property}" is present in the element. As expected!`
        );
      }
    } catch (error) {
      WebHelper.throwError(
        `Failed to assert element has property "${property}": ${error}`
      );
      throw error;
    }
  }

  public async assertElementDontHaveProperty(
    page: Page,
    selector: string,
    property: string,
    index: number = 0
  ): Promise<void> {
    try {
      WebHelper.logInfo(
        `Asserting element does not have property "${property}" for selector: ${selector}`
      );
      const element = page.locator(selector).nth(index);
      const propertyValue = await element.getAttribute(property);
      if (propertyValue !== null) {
        WebHelper.logError(
          `Property "${property}" is present in the element! And it should not be!`
        );
        WebHelper.throwError(
          `Property "${property}" is present in the element! And it should not be!`
        );
      } else {
        WebHelper.logSuccess(
          ` Property "${property}" is not present in the element. As expected!`
        );
      }
    } catch (error) {
      WebHelper.throwError(
        `Failed to assert element does not have property "${property}": ${error}`
      );
      throw error;
    }
  }

  /**
   * 🚫 Block all API requests that might cause page reloads or test re-runs
   * @param page Playwright page instance
   * @param blockedPatterns Array of URL patterns to block (optional)
   */
  public async blockProblematicRequests(
    page: Page,
    blockedPatterns: string[] = []
  ): Promise<void> {
    const defaultPatterns = [
      // Common patterns that might cause reloads
      /.*\/reload.*/i,
      /.*\/refresh.*/i,
      /.*\/restart.*/i,
      /.*\/reset.*/i,
      /.*\/restart.*/i,
      /.*\/hot-reload.*/i,
      /.*\/live-reload.*/i,
      /.*\/dev-server.*/i,
      /.*\/webpack.*/i,
      /.*\/vite.*/i,
      /.*\/hmr.*/i, // Hot Module Replacement
      /.*\/ws.*/, // WebSocket connections
      /.*\/socket\.io.*/,
      /.*\/sse.*/, // Server-Sent Events
      /.*\/eventsource.*/,
      // Add your specific patterns here
      ...blockedPatterns,
    ];

    await page.route("**/*", route => {
      const url = route.request().url();

      // Check if URL matches any blocked pattern
      const shouldBlock = defaultPatterns.some(pattern => {
        if (pattern instanceof RegExp) {
          return pattern.test(url);
        }
        return url.includes(pattern);
      });

      if (shouldBlock) {
        this.logMessage(`🚫 Blocked request: ${url}`);
        route.abort("blockedbyclient");
      } else {
        route.continue();
      }
    });

    this.logMessage("🛡️ Request blocking enabled for problematic endpoints");
  }

  /**
   * 🚫 Block specific request types that commonly cause issues
   * @param page Playwright page instance
   */
  public async blockCommonProblematicRequests(page: Page): Promise<void> {
    // Clear any existing routes first to prevent conflicts
    await page.unroute("**/*");

    await page.route("**/*", route => {
      const request = route.request();
      const url = request.url();
      const method = request.method();

      // Skip blocking for essential resources
      if (this.isEssentialResource(url)) {
        route.continue();
        return;
      }

      // Block WebSocket connections
      if (url.includes("ws://") || url.includes("wss://")) {
        this.logMessage(`🚫 Blocked WebSocket: ${url}`);
        route.abort("blockedbyclient");
        return;
      }

      // Block Server-Sent Events
      if (request.headers()["accept"]?.includes("text/event-stream")) {
        this.logMessage(`🚫 Blocked SSE: ${url}`);
        route.abort("blockedbyclient");
        return;
      }

      // Block hot reload related requests
      if (
        url.includes("hot-reload") ||
        url.includes("live-reload") ||
        url.includes("hmr") ||
        url.includes("dev-server") ||
        url.includes("webpack") ||
        url.includes("vite")
      ) {
        this.logMessage(`🚫 Blocked hot reload: ${url}`);
        route.abort("blockedbyclient");
        return;
      }

      // Block specific API endpoints that might cause reloads
      const problematicEndpoints = [
        "/api/reload",
        "/api/restart",
        "/api/refresh",
        "/api/reset",
        "/api/restart-test",
        "/api/restart-suite",
        "/api/hot-reload",
        "/api/live-reload",
        "/api/dev-server",
      ];

      if (problematicEndpoints.some(endpoint => url.includes(endpoint))) {
        this.logMessage(`🚫 Blocked problematic endpoint: ${url}`);
        route.abort("blockedbyclient");
        return;
      }

      // Block requests that might trigger page reloads
      if (this.isReloadTriggeringRequest(url, method, request.headers())) {
        this.logMessage(
          `🚫 Blocked reload-triggering request: ${method} ${url}`
        );
        route.abort("blockedbyclient");
        return;
      }

      // Allow all other requests
      route.continue();
    });

    this.logMessage("🛡️ Common problematic request blocking enabled");
  }

  /**
   * Check if a URL represents an essential resource that should not be blocked
   */
  private isEssentialResource(url: string): boolean {
    const essentialPatterns = [
      /\.css$/,
      /\.js$/,
      /\.html$/,
      /\.json$/,
      /\.png$/,
      /\.jpg$/,
      /\.jpeg$/,
      /\.gif$/,
      /\.svg$/,
      /\.ico$/,
      /\.woff$/,
      /\.woff2$/,
      /\.ttf$/,
      /\.eot$/,
      /\.map$/,
      /favicon\.ico$/,
    ];

    return essentialPatterns.some(pattern => pattern.test(url));
  }

  /**
   * Check if a request might trigger a page reload
   */
  private isReloadTriggeringRequest(
    url: string,
    method: string,
    headers: Record<string, string>
  ): boolean {
    // Check for reload-related headers
    const reloadHeaders = [
      "x-reload",
      "x-hot-reload",
      "x-live-reload",
      "x-dev-server",
      "x-hmr",
    ];

    const hasReloadHeader = Object.keys(headers).some(header =>
      reloadHeaders.some(reloadHeader =>
        header.toLowerCase().includes(reloadHeader.toLowerCase())
      )
    );

    if (hasReloadHeader) {
      return true;
    }

    // Check for reload-related URL patterns
    const reloadPatterns = [
      /reload/i,
      /restart/i,
      /refresh/i,
      /reset/i,
      /hot-reload/i,
      /live-reload/i,
      /hmr/i,
      /dev-server/i,
      /webpack/i,
      /vite/i,
    ];

    return reloadPatterns.some(pattern => pattern.test(url));
  }

  /**
   * 🚫 Block all network requests except essential ones
   * @param page Playwright page instance
   * @param allowedPatterns Array of URL patterns to allow
   */
  public async blockAllRequestsExcept(
    page: Page,
    allowedPatterns: string[] = []
  ): Promise<void> {
    const defaultAllowed = [
      // Essential resources
      /.*\.css$/,
      /.*\.js$/,
      /.*\.html$/,
      /.*\.json$/,
      /.*\.png$/,
      /.*\.jpg$/,
      /.*\.jpeg$/,
      /.*\.gif$/,
      /.*\.svg$/,
      /.*\.ico$/,
      /.*\.woff$/,
      /.*\.woff2$/,
      /.*\.ttf$/,
      /.*\.eot$/,
      // Add your specific allowed patterns
      ...allowedPatterns,
    ];

    await page.route("**/*", route => {
      const url = route.request().url();

      // Check if URL matches any allowed pattern
      const isAllowed = defaultAllowed.some(pattern => {
        if (pattern instanceof RegExp) {
          return pattern.test(url);
        }
        return url.includes(pattern);
      });

      if (isAllowed) {
        route.continue();
      } else {
        this.logMessage(`🚫 Blocked request: ${url}`);
        route.abort("blockedbyclient");
      }
    });

    this.logMessage(
      "🛡️ Strict request blocking enabled (only essential resources allowed)"
    );
  }

  /**
   * 🔄 Disable all request blocking and restore normal behavior
   * @param page Playwright page instance
   */
  public async disableRequestBlocking(page: Page): Promise<void> {
    await page.unroute("**/*");
    this.logMessage("✅ Request blocking disabled - normal behavior restored");
  }

  /**
   * 📊 Monitor and log all requests without blocking them
   * @param page Playwright page instance
   */
  public async monitorRequests(page: Page): Promise<void> {
    page.on("request", request => {
      this.logMessage(`📤 Request: ${request.method()} ${request.url()}`);
    });

    page.on("response", response => {
      this.logMessage(`📥 Response: ${response.status()} ${response.url()}`);
    });

    page.on("requestfailed", request => {
      this.logMessage(
        `❌ Request failed: ${request.url()} - ${request.failure()?.errorText}`
      );
    });

    this.logMessage("📊 Request monitoring enabled");
  }

  /**
   * 🎯 Block requests by specific criteria
   * @param page Playwright page instance
   * @param options Blocking criteria
   */
  public async blockRequestsByCriteria(
    page: Page,
    options: {
      methods?: string[];
      urlPatterns?: (string | RegExp)[];
      resourceTypes?: string[];
      headers?: Record<string, string>;
    } = {}
  ): Promise<void> {
    await page.route("**/*", route => {
      const request = route.request();
      const url = request.url();
      const method = request.method();
      const resourceType = request.resourceType();

      let shouldBlock = false;

      // Block by method
      if (options.methods?.includes(method)) {
        shouldBlock = true;
      }

      // Block by URL patterns
      if (
        options.urlPatterns?.some(pattern => {
          if (pattern instanceof RegExp) {
            return pattern.test(url);
          }
          return url.includes(pattern);
        })
      ) {
        shouldBlock = true;
      }

      // Block by resource type
      if (options.resourceTypes?.includes(resourceType)) {
        shouldBlock = true;
      }

      // Block by headers
      if (options.headers) {
        const requestHeaders = request.headers();
        const hasMatchingHeaders = Object.entries(options.headers).every(
          ([key, value]) => requestHeaders[key]?.includes(value)
        );
        if (hasMatchingHeaders) {
          shouldBlock = true;
        }
      }

      if (shouldBlock) {
        this.logMessage(
          `🚫 Blocked request: ${method} ${url} (${resourceType})`
        );
        route.abort("blockedbyclient");
      } else {
        route.continue();
      }
    });

    this.logMessage("🎯 Custom request blocking enabled");
  }

  public async findElementWithText(
    page: Page,
    selector: string,
    text: string
  ): Promise<Locator> {
    try {
      WebHelper.logInfo(
        `Finding element with text "${text}" for selector: ${selector}`
      );
      const element = page.locator(selector).filter({ hasText: text });
      await element.waitFor({ state: "visible" });
      WebHelper.logSuccess(`Found element with text "${text}"`);
      return element;
    } catch (error) {
      WebHelper.logError(
        `Failed to find element with text "${text}": ${error}`
      );
      throw error;
    }
  }

  public async doubleClick(
    page: Page,
    selector: string,
    identifier: string
  ): Promise<void> {
    try {
      WebHelper.logInfo(`Double clicking element ${identifier}`);
      await page.dblclick(selector, {
        force: true,
        strict: false,
      });
      WebHelper.logSuccess(`Successfully double clicked element ${identifier}`);
    } catch (error) {
      WebHelper.logError(
        `Failed to double click element ${identifier}: ${error}`
      );
      throw error;
    }
  }

  public async getElementVisibilityStatusWithTimeout(
    page: Page,
    selector: string,
    index: number = 0,
    timeout: number = 10000
  ): Promise<boolean> {
    try {
      WebHelper.logInfo(
        `Getting element visibility status with timeout for selector: ${selector} at index ${index}`
      );
      const isVisible = await page
        .locator(selector)
        .nth(index)
        .isVisible({ timeout });
      WebHelper.logSuccess(
        `Element visibility status with timeout: ${isVisible}`
      );
      return isVisible;
    } catch (error) {
      WebHelper.logError(
        `Failed to get element visibility status with timeout: ${error}`
      );
      throw error;
    }
  }

  public async waitForTextDifferentThan(
    page: Page,
    selector: string,
    text: string,
    timeout: number = 60000
  ): Promise<void> {
    try {
      WebHelper.logInfo(
        `Waiting for text to be different than "${text}" in element with selector: ${selector}`
      );
      const timeoutSeconds = timeout / 1000;
      for (let i = 0; i < timeoutSeconds; i++) {
        await page.waitForTimeout(1000);
        const elementText = await page.locator(selector).textContent();
        if (elementText !== text) {
          WebHelper.logSuccess(
            `Text "${elementText}" is different than "${text}" in element "${selector}", as expected!`
          );
          return;
        }
      }
      WebHelper.throwError(
        `Text "${text}" is not different than "${text}" in element "${selector}" in ${timeoutSeconds} seconds`
      );
    } catch (error) {
      WebHelper.throwError(
        `Failed to wait for text different than "${text}": ${error}`
      );
    }
  }

  public async assertPlaceholderText(
    page: Page,
    selector: string,
    identifier: string,
    elementIndex: number = 0
  ): Promise<void> {
    await page
      .locator(selector)
      .nth(elementIndex)
      .waitFor({ state: "visible" });
    const placeholder = await page
      .locator(selector)
      .nth(elementIndex)
      .getAttribute("placeholder");
    if (placeholder) {
      WebHelper.logSuccess(
        `The placeholder text "${placeholder}" is present in the element "${identifier}"`
      );
    } else {
      WebHelper.throwError(
        `The placeholder text is not present in the element "${identifier}"`
      );
    }
  }

  public async clickByText(
    page: Page,
    selector: string,
    identifier: string,
    text: string,
    elementIndex: number
  ): Promise<void> {
    try {
      WebHelper.logInfo(
        `Clicking element by text "${text}" for selector: ${selector}`
      );
      await page
        .locator(selector)
        .filter({ hasText: text })
        .nth(elementIndex)
        .click();
      WebHelper.logSuccess(`Successfully clicked element by text "${text}"`);
    } catch (error) {
      WebHelper.logError(`Failed to click element by text "${text}": ${error}`);
      WebHelper.throwError(
        `Failed to click element by text "${text}": ${error}`
      );
    }
  }
}
