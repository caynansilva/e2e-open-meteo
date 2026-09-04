import { IWorldOptions, setWorldConstructor, World } from "@cucumber/cucumber";
import { PageFactory } from "../Factories/PageFactory";
import { BrowserManager } from "../Utils/BrowserManager";
import { Page, BrowserContext, Browser } from "@playwright/test";

export interface CucumberApiResponse {
  status: number;
  statusText: string;
  body: unknown;
  headers: Headers;
}

/**
 * CucumberWorld - Custom World class for Cucumber BDD tests
 * 
 * This class extends Cucumber's World to provide:
 * - Playwright browser management
 * - Shared state across step definitions
 * - Browser lifecycle management
 * 
 * Usage in step definitions:
 * ```typescript
 * import { Given, When, Then } from '@cucumber/cucumber';
 * import { CucumberWorld } from '../Support/CucumberWorld';
 * 
 * Given('I navigate to {string}', async function (this: CucumberWorld, url: string) {
 *   await this.page.goto(url);
 * });
 * ```
 */
export class CucumberWorld extends World {
  private readonly browserManager: BrowserManager;
  public browser?: Browser;
  public context?: BrowserContext;
  public page?: Page;
  public lastApiResponse?: CucumberApiResponse;
  private pageFactory?: PageFactory;

  // Shared test data storage
  public testData: Record<string, unknown> = {};

  constructor(options: IWorldOptions) {
    super(options);
    this.browserManager = new BrowserManager();
  }

  /**
   * Initialize browser before test
   */
  async initBrowser(options?: {
    browserType?: "chromium" | "firefox" | "webkit";
    headless?: boolean;
    viewportWidth?: number;
    viewportHeight?: number;
    storageStatePath?: string;
  }): Promise<void> {
    this.browserManager.configure({
      browserType: options?.browserType || "chromium",
      headless: options?.headless ?? true,
      viewportWidth: options?.viewportWidth || 1920,
      viewportHeight: options?.viewportHeight || 1080,
    });

    if (options?.storageStatePath) {
      this.page = await this.browserManager.launchWithStorageState(
        options.storageStatePath
      );
    } else {
      this.page = await this.browserManager.launch();
    }

    this.browser = this.browserManager.getBrowser() ?? undefined;
    this.context = this.browserManager.getContext() ?? undefined;
    this.pageFactory = new PageFactory(this.requirePage());
  }

  /**
   * Close browser after test
   */
  async closeBrowser(): Promise<void> {
    await this.browserManager.close();
    this.pageFactory?.clearCache();
    this.pageFactory = undefined;
    this.browser = undefined;
    this.context = undefined;
    this.page = undefined;
  }

  /**
   * Take screenshot
   */
  async takeScreenshot(path?: string): Promise<Buffer | undefined> {
    return await this.browserManager.takeScreenshot(path);
  }

  /**
   * Save storage state for authenticated sessions
   */
  async saveStorageState(path: string): Promise<void> {
    await this.browserManager.saveStorageState(path);
  }

  /**
   * Store data for sharing between steps
   */
  setData(key: string, value: unknown): void {
    this.testData[key] = value;
  }

  /**
   * Retrieve stored data
   */
  getData<T>(key: string): T | undefined {
    return this.testData[key] as T;
  }

  /**
   * Clear all stored data
   */
  clearData(): void {
    this.testData = {};
  }

  public requirePage(): Page {
    if (!this.page) {
      throw new Error("This step requires an @ui scenario with an initialized browser page.");
    }

    return this.page;
  }

  public getPageObject<T>(PageObjectClass: new (page: Page) => T): T {
    if (!this.pageFactory) {
      this.pageFactory = new PageFactory(this.requirePage());
    }

    return this.pageFactory.getOrCreate(PageObjectClass);
  }

  public hasBrowser(): boolean {
    return this.page !== undefined;
  }
}

setWorldConstructor(CucumberWorld);
