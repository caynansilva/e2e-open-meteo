import { Page } from "@playwright/test";
import * as fs from "fs";
import * as path from "path";
import { AssertionResult, AssertionSummary } from "../Types";

/**
 * AssertionLogger - Comprehensive test assertion logging
 *
 * This singleton class provides:
 * - Detailed assertion logging with screenshots
 * - Summary report generation
 * - JSON export for analysis
 * - Console output with colors and formatting
 */
export class AssertionLogger {
  private results: AssertionResult[] = [];
  private startTime: Date = new Date();
  private static instance: AssertionLogger;
  private currentReportPath: string = "reports";
  private currentScreenshotPath: string = "screenshots";

  public static getInstance(): AssertionLogger {
    if (!AssertionLogger.instance) {
      AssertionLogger.instance = new AssertionLogger();
    }
    return AssertionLogger.instance;
  }

  public static reset(): void {
    AssertionLogger.instance = new AssertionLogger();
  }

  private constructor() {
    this.startTime = new Date();
  }

  /**
   * Set custom paths for organized reporting
   */
  public setReportPaths(executionPath: string): void {
    this.currentReportPath = executionPath;
    this.currentScreenshotPath = path.join(
      executionPath,
      "failure-screenshots"
    );
  }

  /**
   * Log an assertion with detailed information
   */
  public async logAssertion(
    result: Omit<AssertionResult, "timestamp">,
    page?: Page,
    takeScreenshot: boolean = false
  ): Promise<void> {
    const timestamp = new Date().toISOString();
    const assertionResult: AssertionResult = {
      ...result,
      timestamp,
    };

    // Take screenshot if requested and page is available
    if (takeScreenshot && page && result.status === "FAILED") {
      try {
        // Ensure screenshot directory exists
        if (!fs.existsSync(this.currentScreenshotPath)) {
          fs.mkdirSync(this.currentScreenshotPath, { recursive: true });
        }

        const sanitizedId = result.elementIdentifier.replace(
          /[^a-zA-Z0-9]/g,
          "_"
        );
        const screenshotPath = path.join(
          this.currentScreenshotPath,
          `assertion-${Date.now()}-${sanitizedId}.png`
        );
        await page.screenshot({
          path: screenshotPath,
          fullPage: true,
        });
        assertionResult.screenshotPath = screenshotPath;
      } catch (error) {
        console.warn(`Failed to take screenshot: ${error}`);
      }
    }

    this.results.push(assertionResult);

    // Enhanced console logging with colors and formatting
    let statusIcon: string;
    let consoleStyle: string;
    switch (result.status) {
      case "PASSED":
        statusIcon = "✅";
        consoleStyle = "🟢";
        break;
      case "FAILED":
        statusIcon = "❌";
        consoleStyle = "🔴";
        break;
      case "SKIPPED":
        statusIcon = "⏭️";
        consoleStyle = "🟡";
        break;
      case "INFO":
        statusIcon = "ℹ️";
        consoleStyle = "🔵";
        break;
      case "WARNING":
        statusIcon = "⚠️";
        consoleStyle = "🟡";
        break;
      default:
        statusIcon = "ℹ️";
        consoleStyle = "🔵";
    }

    const logMessage = `${statusIcon} [${result.assertionType}] ${result.elementIdentifier}: ${result.message}`;

    if (result.status === "PASSED") {
      console.log(`${consoleStyle} ${logMessage}`);
    } else if (result.status === "FAILED") {
      console.error(`${consoleStyle} ${logMessage}`);
      if (result.expectedValue && result.actualValue) {
        console.error(`   Expected: "${result.expectedValue}"`);
        console.error(`   Actual: "${result.actualValue}"`);
      }
      if (assertionResult.screenshotPath) {
        console.error(`   Screenshot: ${assertionResult.screenshotPath}`);
      }
    } else if (result.status === "INFO") {
      console.info(`${consoleStyle} ${logMessage}`);
    } else {
      console.warn(`${consoleStyle} ${logMessage}`);
    }
  }

  /**
   * Log element presence assertion
   */
  public async logElementPresence(
    elementIdentifier: string,
    selector: string,
    isVisible: boolean,
    page?: Page,
    takeScreenshot: boolean = false
  ): Promise<void> {
    const startTime = Date.now();

    await this.logAssertion(
      {
        elementIdentifier,
        assertionType: "ELEMENT_PRESENCE",
        status: isVisible ? "PASSED" : "FAILED",
        message: isVisible
          ? `Element is visible and present on the page`
          : `Element is NOT visible or present on the page`,
        selector,
        duration: Date.now() - startTime,
      },
      page,
      takeScreenshot && !isVisible
    );
  }

  /**
   * Log text assertion
   */
  public async logTextAssertion(
    elementIdentifier: string,
    selector: string,
    expectedText: string,
    actualText: string,
    passed: boolean,
    page?: Page
  ): Promise<void> {
    const startTime = Date.now();

    await this.logAssertion(
      {
        elementIdentifier,
        assertionType: "TEXT_CONTENT",
        status: passed ? "PASSED" : "FAILED",
        message: passed
          ? `Text content matches expected value`
          : `Text content does NOT match expected value`,
        selector,
        expectedValue: expectedText,
        actualValue: actualText,
        duration: Date.now() - startTime,
      },
      page,
      !passed
    );
  }

  /**
   * Generate a comprehensive summary
   */
  public generateSummary(): AssertionSummary {
    const endTime = new Date();
    const passed = this.results.filter(r => r.status === "PASSED").length;
    const failed = this.results.filter(r => r.status === "FAILED").length;
    const skipped = this.results.filter(r => r.status === "SKIPPED").length;
    const info = this.results.filter(r => r.status === "INFO").length;

    // Total assertions should exclude INFO messages
    const totalAssertions = this.results.length - info;

    return {
      totalAssertions,
      passed,
      failed,
      skipped,
      startTime: this.startTime.toISOString(),
      endTime: endTime.toISOString(),
      duration: endTime.getTime() - this.startTime.getTime(),
      results: this.results,
    };
  }

  /**
   * Print a detailed summary report
   */
  public printSummaryReport(): void {
    const summary = this.generateSummary();

    console.log("\n" + "=".repeat(80));
    console.log("📊 ASSERTION SUMMARY REPORT");
    console.log("=".repeat(80));
    console.log(`📈 Total Assertions: ${summary.totalAssertions}`);
    console.log(`✅ Passed: ${summary.passed}`);
    console.log(`❌ Failed: ${summary.failed}`);
    console.log(`⏭️ Skipped: ${summary.skipped}`);
    console.log(`⏱️ Duration: ${summary.duration}ms`);
    console.log(`📅 Started: ${summary.startTime}`);
    console.log(`🏁 Ended: ${summary.endTime}`);

    if (summary.failed > 0) {
      console.log("\n🔍 FAILED ASSERTIONS:");
      summary.results
        .filter(r => r.status === "FAILED")
        .forEach((result, index) => {
          console.log(`\n${index + 1}. ❌ ${result.elementIdentifier}`);
          console.log(`   Type: ${result.assertionType}`);
          console.log(`   Message: ${result.message}`);
          console.log(`   Selector: ${result.selector}`);
          if (result.expectedValue && result.actualValue) {
            console.log(`   Expected: "${result.expectedValue}"`);
            console.log(`   Actual: "${result.actualValue}"`);
          }
          if (result.screenshotPath) {
            console.log(`   Screenshot: ${result.screenshotPath}`);
          }
          console.log(`   Time: ${result.timestamp}`);
        });
    }

    console.log("\n" + "=".repeat(80));

    // Calculate success rate
    const successRate =
      summary.totalAssertions > 0
        ? ((summary.passed / summary.totalAssertions) * 100).toFixed(2)
        : "0.00";
    console.log(`🎯 Success Rate: ${successRate}%`);
    console.log("=".repeat(80) + "\n");
  }

  /**
   * Export summary to JSON
   */
  public exportSummaryToJson(
    fileName: string = `assertion-summary-${Date.now()}.json`,
    reportPath?: string
  ): string {
    const summary = this.generateSummary();

    // Use provided path or default
    const targetDir = reportPath || path.join(process.cwd(), "reports");
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }

    const fullPath = path.join(targetDir, fileName);
    fs.writeFileSync(fullPath, JSON.stringify(summary, null, 2));

    console.log(`📄 Assertion summary exported to: ${fullPath}`);
    return fullPath;
  }

  /**
   * Get all assertion results
   */
  public getResults(): AssertionResult[] {
    return [...this.results];
  }

  /**
   * Get only failed assertions
   */
  public getFailedResults(): AssertionResult[] {
    return this.results.filter(r => r.status === "FAILED");
  }

  /**
   * Check if all assertions passed
   */
  public allAssertionsPassed(): boolean {
    const assertionResults = this.results.filter(r => r.status !== "INFO");
    return (
      assertionResults.length > 0 &&
      assertionResults.every(r => r.status === "PASSED")
    );
  }

  private getElementIdentifier(
    status: "PASSED" | "FAILED" | "SKIPPED" | "STEP" | "WARNING" | "INFO"
  ): string {
    switch (status) {
      case "PASSED":
        return "Assert Message";
      case "FAILED":
        return "Assert Message";
      case "SKIPPED":
        return "Skip Message";
      case "STEP":
        return "BDD Gherkin Step";
      case "WARNING":
        return "Warning Message";
      default:
      case "INFO":
        return "Information Message";
    }
  }

  private getAssertionType(
    status: "PASSED" | "FAILED" | "SKIPPED" | "STEP" | "WARNING" | "INFO"
  ): string {
    switch (status) {
      case "PASSED":
        return "SUCCESS_MESSAGE";
      case "FAILED":
        return "FAILED_MESSAGE";
      case "SKIPPED":
        return "SKIPPED_MESSAGE";
      case "STEP":
        return "BDD_GHERKIN_STEP";
      case "WARNING":
        return "WARNING_MESSAGE";
      default:
      case "INFO":
        return "INFORMATION_MESSAGE";
    }
  }

  public logAssertionMessage(
    message: string,
    status:
      | "PASSED"
      | "FAILED"
      | "SKIPPED"
      | "STEP"
      | "WARNING"
      | "INFO" = "INFO"
  ): void {
    const timestamp = new Date().toISOString();
    const result: AssertionResult = {
      elementIdentifier: this.getElementIdentifier(status),
      assertionType: this.getAssertionType(status),
      status: status,
      message: message,
      timestamp: timestamp,
    };

    this.results.push(result);

    // Immediately log to console with proper formatting
    let statusIcon: string;
    let consoleStyle: string;
    switch (status) {
      case "PASSED":
        statusIcon = "✅";
        consoleStyle = "🟢";
        break;
      case "FAILED":
        statusIcon = "❌";
        consoleStyle = "🔴";
        break;
      case "SKIPPED":
        statusIcon = "⏭️";
        consoleStyle = "🟡";
        break;
      case "INFO":
        statusIcon = "ℹ️";
        consoleStyle = "🔵";
        break;
      case "STEP":
        statusIcon = "👣";
        consoleStyle = "🔵";
        break;
      default:
        statusIcon = "ℹ️";
        consoleStyle = "🔵";
        break;
    }

    const logMessage = `${consoleStyle} ${statusIcon} ${message}`;

    switch (status) {
      case "PASSED":
        console.log(logMessage);
        break;
      case "FAILED":
        console.error(logMessage);
        break;
      case "INFO":
        console.info(logMessage);
        break;
      case "SKIPPED":
        console.warn(logMessage);
        break;
      case "STEP":
        console.log(logMessage);
        break;
    }
  }
}
