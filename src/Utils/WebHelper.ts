/* eslint-disable no-console */
import { expect, Page } from "@playwright/test";
import { AssertionLogger } from "./AssertionLogger";
import { Environment } from "./Environment";
import { WebElement } from "../Core/WebElement";

/**
 * WebHelper - Static utility methods for Playwright testing
 * 
 * This class provides common utilities:
 * - Navigation and page management
 * - Random data generation
 * - Date manipulation
 * - API requests
 * - Logging and assertions
 * - Browser cache management
 */
export class WebHelper {
  
  public static async navigateToUrl(page: Page, url: string): Promise<void> {
    this.logInfo(
      `**************** Navigating to URL: "${url}" ****************`
    );
    await page.goto(url);
  }

  // ========================================
  // Random Data Generation
  // ========================================

  public static getRandomString(length: number): string {
    return Math.random()
      .toString(36)
      .substring(2, 2 + length);
  }

  public static getRandomStringLetterOnly(length: number): string {
    return Math.random()
      .toString(36)
      .substring(2, 2 + length)
      .replace(/[^a-zA-Z]/g, "")
      .toUpperCase();
  }

  public static getRandomNumber(min: number, max: number): number {
    return Math.floor(min + Math.random() * (max - min + 1));
  }

  public static getRandomCardNumber(): string {
    return Math.floor(
      6000000000000000 + Math.random() * 9000000000000000
    ).toString();
  }

  // ========================================
  // Date Utilities
  // ========================================

  public static getCurrentDate(): string {
    const currentDate = new Date();
    return currentDate.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  }

  public static getCurrentDateTypeOne(): string {
    const currentDate = new Date();
    const dateISO = currentDate.toISOString();
    const formattedDate = dateISO.split("T")[0] ?? "";
    return formattedDate;
  }

  public static getSumDate(date: string, days: number): string {
    const dateObject = new Date(date);
    dateObject.setDate(dateObject.getDate() + days);
    return dateObject.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  }

  public static getSumDateTypeOne(date: string, days: number): string {
    const dateObject = new Date(date);
    dateObject.setDate(dateObject.getDate() + days);
    return dateObject.toISOString().split("T")[0] ?? "";
  }

  // ========================================
  // Wait Utilities
  // ========================================

  public static async waitTime(time: number, page: Page): Promise<void> {
    return await new Promise((resolve) => setTimeout(resolve, time, page));
  }

  public static async waitForSeconds(
    seconds: number,
    page: Page
  ): Promise<void> {
    try {
      await page.waitForTimeout(seconds * 1000);
    } catch (error) {
      throw new Error(`Error during wait: ${error}`);
    }
  }

  public static async waitForMinutes(
    minutes: number,
    page: Page
  ): Promise<void> {
    try {
      await this.waitForSeconds(minutes * 60, page);
    } catch (error) {
      throw new Error(`Error during wait: ${error}`);
    }
  }

  public static async waitForCondition(
    page: Page,
    condition: () => boolean | Promise<boolean>,
    timeoutMs: number = 60000,
    intervalMs: number = 100
  ): Promise<void> {
    const startTime = Date.now();

    while (true) {
      try {
        const result = await condition();
        if (result) {
          return;
        }
      } catch {
        // Continue checking
      }

      if (Date.now() - startTime >= timeoutMs) {
        throw new Error(`Timeout waiting for condition after ${timeoutMs}ms`);
      }

      await this.waitForSeconds(intervalMs, page);
    }
  }

  // ========================================
  // Text Formatting
  // ========================================

  public static formatText(text: string | null | undefined): string {
    if (!text) {
      return "";
    }
    return text.replace(/\n/g, "").replace(/\s+/g, " ").trim();
  }

  // ========================================
  // API Requests
  // ========================================

  public static async sendAPIRequest(
    url: string,
    method: string,
    body?: any,
    headers?: Record<string, string>
  ): Promise<{
    status: number;
    statusText: string;
    body: any;
    headers: Headers;
  }> {
    this.logInfo(
      `Sending API request: \n method: "${method}" \n url: "${url}"`
    );

    if (headers) {
      const safeHeaders = { ...headers };
      if (safeHeaders.Authorization) {
        safeHeaders.Authorization = `Bearer [TOKEN_MASKED]`;
      }
      this.logInfo(`Request headers: ${JSON.stringify(safeHeaders)}`);
    }

    try {
      const requestOptions: any = {
        method: method,
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          ...(headers || {}),
        },
      };

      if (body !== undefined && method !== "GET") {
        requestOptions.body = JSON.stringify(body);
      }

      const response = await fetch(url, requestOptions);
      const contentType = response.headers.get("content-type") || "";
      const isJson = contentType.includes("application/json");

      let responseBody: any;

      if (isJson) {
        try {
          responseBody = await response.json();
        } catch {
          const textResponse = await response.text();
          this.logError(
            `Failed to parse JSON response. Content-Type: ${contentType}. Response preview: ${textResponse.substring(0, 200)}`
          );
          throw new Error(
            `Invalid JSON response. Response preview: ${textResponse.substring(0, 200)}`
          );
        }
      } else {
        const textResponse = await response.text();
        this.logError(
          `API returned non-JSON response. Status: ${response.status}, Content-Type: ${contentType}`
        );

        if (
          textResponse.trim().startsWith("<!DOCTYPE") ||
          textResponse.trim().startsWith("<html")
        ) {
          throw new Error(
            `Authentication failed: Server returned HTML instead of JSON. Status: ${response.status}, URL: ${url}`
          );
        }

        responseBody = { raw: textResponse, contentType };
      }

      this.logInfo(
        `API request successful: ${response.status} ${response.statusText}`
      );

      return {
        status: response.status,
        statusText: response.statusText,
        body: responseBody,
        headers: response.headers,
      };
    } catch (error: any) {
      const errorMessage = error.message || String(error);
      this.throwError(
        `API request failed: "${errorMessage}". \n url: "${url}" \n Method: "${method}"`
      );
    }
  }

  public static async handleAuthenticationAlert(
    page: Page,
    url: string,
    username: string,
    password: string
  ): Promise<void> {
    await page.context().setHTTPCredentials({
      username: username,
      password: password,
    });
    await page.goto(url);
  }

  // ========================================
  // Logging Methods
  // ========================================

  public static logMessage(message: string): void {
    console.log(message);
  }

  public static logAssertionMessage(
    message: string,
    status:
      | "PASSED"
      | "FAILED"
      | "SKIPPED"
      | "WARNING"
      | "STEP"
      | "INFO" = "INFO"
  ): void {
    AssertionLogger.getInstance().logAssertionMessage(message, status);
  }

  public static logStep(message: string): void {
    this.logAssertionMessage(message, "STEP");
  }

  public static logWarning(message: string): void {
    this.logAssertionMessage(`⚠️ ${message}`, "WARNING");
  }

  public static logSuccess(message: string): void {
    this.logAssertionMessage(`✅ ${message}`, "PASSED");
  }

  public static logSkipped(message: string): void {
    this.logAssertionMessage(`⏭️ ${message}`, "SKIPPED");
  }

  public static logFailed(message: string): void {
    this.logAssertionMessage(`❌ ${message}`, "FAILED");
  }

  public static logError(message: string): void {
    this.logAssertionMessage(`❌ ${message}`, "FAILED");
  }

  public static logInfo(message: string, context: string = "Info"): void {
    this.logAssertionMessage(`[${context}] ${message}`, "INFO");
  }

  public static throwError(message: string): never {
    this.logError(message);
    throw new Error(message);
  }

  // ========================================
  // Browser Management
  // ========================================

  public static async setScreenSize(
    page: Page,
    width: number = 1920,
    height: number = 1080
  ): Promise<void> {
    try {
      await page.setViewportSize({ width, height });
    } catch (err) {
      console.log("Error Setting the ViewPort: " + err);
    }
    Environment.setPageWidth(width);
    Environment.setPageHeight(height);
  }

  public static async clearBrowserCache(page: Page): Promise<void> {
    const session = await page.context().newCDPSession(page);
    await session.send("Network.clearBrowserCache");
    await session.send("Network.clearBrowserCookies");
  }

  public static async clearLocalStorage(page: Page): Promise<void> {
    try {
      await page.goto(Environment.getBaseUrl());

      await page.evaluate(() => {
        try {
          window.localStorage.clear();
          window.sessionStorage.clear();
          console.log("✅ Storage cleared successfully");
        } catch (err) {
          console.log("⚠️ Could not clear storage:", err);
        }
      });
    } catch (err) {
      console.log("⚠️ Error during storage clearing:", err);
    }
  }

  public static async clearAllStorage(page: Page): Promise<void> {
    try {
      await this.clearBrowserCache(page);
      await this.clearLocalStorage(page);
    } catch (err) {
      console.log("⚠️ Error during storage clearing:", err);
    }
  }

  public static async refreshPage(page: Page): Promise<void> {
    await page.reload();
  }

  public static async reloadPage(page: Page): Promise<void> {
    await page.reload();
  }

  public static async pwWait(
    page: Page,
    milliseconds: number = 60000
  ): Promise<void> {
    try {
      await page.waitForTimeout(milliseconds);
    } catch (error) {
      console.log("Error waiting for timeout: " + error);
    }
  }

  // ========================================
  // Assertion Methods
  // ========================================

  public static async validateElementOrderOnPage(
    page: Page,
    elementOne: WebElement,
    elementTwo: WebElement
  ): Promise<void> {
    const firstElement = page.locator(elementOne.selector).nth(0);
    const secondElement = page.locator(elementTwo.selector).nth(0);

    await expect(firstElement).toBeVisible();
    await expect(secondElement).toBeVisible();

    const firstBox = await firstElement.boundingBox();
    const secondBox = await secondElement.boundingBox();

    if (firstBox && secondBox && firstBox.x < secondBox.x) {
      this.logAssertionMessage(
        `${elementOne.identifier} is to the left of ${elementTwo.identifier}`,
        "PASSED"
      );
      return;
    }
    this.throwError(
      `${elementOne.identifier} should be to the left of ${elementTwo.identifier} but the position is ${firstBox?.x} and ${secondBox?.x}`
    );
  }

  public static async assert(
    condition: boolean,
    successMessage: string,
    errorMessage: string
  ): Promise<void> {
    if (condition === true) {
      this.logSuccess(successMessage);
    } else {
      this.throwError(errorMessage);
    }
  }

  public static async assertWarning(
    condition: boolean,
    successMessage: string,
    errorMessage: string
  ): Promise<void> {
    if (condition === true) {
      this.logSuccess(successMessage);
    } else {
      this.logWarning(errorMessage);
    }
  }

  public static async assertError(
    condition: boolean,
    successMessage: string,
    errorMessage: string
  ): Promise<void> {
    if (condition === true) {
      this.logSuccess(successMessage);
    } else {
      this.logError(errorMessage);
    }
  }

  public static doNothing(): void {
    console.log("🚫 Do nothing");
  }

  // ========================================
  // Date Validation
  // ========================================

  public static assertDateValueSlashFormatDDMMYYYYIsValid(
    dateValue: string
  ): boolean {
    if (!/^\d{2}\/\d{2}\/\d{4}$/.test(dateValue)) {
      return false;
    }

    const parts = dateValue.split("/").map(Number);
    const day = parts[0] ?? 0;
    const month = parts[1] ?? 0;
    const year = parts[2] ?? 0;
    const date = new Date(year, month - 1, day);

    return (
      date.getFullYear() === year &&
      date.getMonth() === month - 1 &&
      date.getDate() === day
    );
  }

  public static assertDateValueHyphenFormatDDMMYYYYIsValid(
    dateValue: string
  ): boolean {
    if (!/^\d{2}-\d{2}-\d{4}$/.test(dateValue)) {
      return false;
    }

    const parts = dateValue.split("-").map(Number);
    const day = parts[0] ?? 0;
    const month = parts[1] ?? 0;
    const year = parts[2] ?? 0;
    const date = new Date(year, month - 1, day);

    return (
      date.getFullYear() === year &&
      date.getMonth() === month - 1 &&
      date.getDate() === day
    );
  }

  public static assertDateValueHyphenFormatYYYYMMDDIsValid(
    dateValue: string
  ): boolean {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(dateValue)) {
      return false;
    }

    const parts = dateValue.split("-").map(Number);
    const year = parts[0] ?? 0;
    const month = parts[1] ?? 0;
    const day = parts[2] ?? 0;
    const date = new Date(year, month - 1, day);

    return (
      date.getFullYear() === year &&
      date.getMonth() === month - 1 &&
      date.getDate() === day
    );
  }

  // ========================================
  // Clipboard Methods
  // ========================================

  public static async assertClipboardWithPermissionsDataMatchesText(
    expectedText: string,
    page: Page
  ): Promise<void> {
    await page.context().grantPermissions(["clipboard-read"]);

    const copiedData = await page.evaluate(async () => {
      return navigator.clipboard.readText();
    });

    console.log("Copied data: " + copiedData);
    expect(copiedData, "Copied data should match the expected text").toContain(
      expectedText
    );
  }

  public static async verifyClipboardContent(
    page: Page,
    expectedContent: string,
    successMessage: string
  ): Promise<void> {
    const clipboardText = await page.evaluate(() =>
      navigator.clipboard.readText()
    );
    console.log(`Clipboard content:`, clipboardText);
    expect(clipboardText, successMessage).toContain(expectedContent);
  }

  public static async sendKeys(page: Page, keys: string): Promise<void> {
    await page.keyboard.press(keys);
    this.logInfo(`Successfully sent keys: ${keys}`);
  }
}