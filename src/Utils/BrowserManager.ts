import {
  Browser,
  BrowserContext,
  chromium,
  firefox,
  Page,
  webkit,
} from "@playwright/test";
import { Environment } from "./Environment";

/**
 * BrowserManager - Manages Playwright browser lifecycle
 *
 * This class handles:
 * - Browser launch (chromium, firefox, webkit)
 * - Context and page creation
 * - Browser cleanup
 * - Configuration options (headless, viewport, video, tracing)
 */
export class BrowserManager {
  private browser: Browser | null = null;
  private context: BrowserContext | null = null;
  private page: Page | null = null;

  private browserType: "chromium" | "firefox" | "webkit" = "chromium";
  private headless: boolean = true;
  private viewportWidth: number = 1920;
  private viewportHeight: number = 1080;
  private recordVideo: boolean = false;
  private tracingEnabled: boolean = false;

  /**
   * Configure browser options before launch
   */
  public configure(options: {
    browserType?: "chromium" | "firefox" | "webkit";
    headless?: boolean;
    viewportWidth?: number;
    viewportHeight?: number;
    recordVideo?: boolean;
    tracingEnabled?: boolean;
  }): BrowserManager {
    if (options.browserType) this.browserType = options.browserType;
    if (options.headless !== undefined) this.headless = options.headless;
    if (options.viewportWidth) this.viewportWidth = options.viewportWidth;
    if (options.viewportHeight) this.viewportHeight = options.viewportHeight;
    if (options.recordVideo !== undefined)
      this.recordVideo = options.recordVideo;
    if (options.tracingEnabled !== undefined)
      this.tracingEnabled = options.tracingEnabled;

    return this;
  }

  /**
   * Launch browser and create context/page
   */
  public async launch(): Promise<Page> {
    console.log(`🌐 Launching ${this.browserType} browser...`);

    // Select browser type
    const browserLauncher =
      this.browserType === "firefox"
        ? firefox
        : this.browserType === "webkit"
          ? webkit
          : chromium;

    // Launch browser
    this.browser = await browserLauncher.launch({
      headless: this.headless,
      slowMo: 0,
    });

    // Create context with options
    const contextOptions: Parameters<Browser["newContext"]>[0] = {
      viewport: {
        width: this.viewportWidth,
        height: this.viewportHeight,
      },
      ignoreHTTPSErrors: true,
    };

    // Add video recording if enabled
    if (this.recordVideo) {
      contextOptions.recordVideo = {
        dir: "./test-results/videos",
        size: { width: this.viewportWidth, height: this.viewportHeight },
      };
    }

    this.context = await this.browser.newContext(contextOptions);

    // Enable tracing if configured
    if (this.tracingEnabled) {
      await this.context.tracing.start({
        screenshots: true,
        snapshots: true,
        sources: true,
      });
    }

    // Create page
    this.page = await this.context.newPage();

    // Update environment with viewport dimensions
    Environment.setPageWidth(this.viewportWidth);
    Environment.setPageHeight(this.viewportHeight);

    console.log(
      `✅ Browser launched with ${this.viewportWidth}x${this.viewportHeight} viewport`
    );

    return this.page;
  }

  /**
   * Launch browser with storage state for authenticated sessions
   */
  public async launchWithStorageState(storageStatePath: string): Promise<Page> {
    console.log(
      `🌐 Launching ${this.browserType} browser with storage state...`
    );

    const browserLauncher =
      this.browserType === "firefox"
        ? firefox
        : this.browserType === "webkit"
          ? webkit
          : chromium;

    this.browser = await browserLauncher.launch({
      headless: this.headless,
    });

    const contextOptions: Parameters<Browser["newContext"]>[0] = {
      viewport: {
        width: this.viewportWidth,
        height: this.viewportHeight,
      },
      ignoreHTTPSErrors: true,
      storageState: storageStatePath,
    };

    if (this.recordVideo) {
      contextOptions.recordVideo = {
        dir: "./test-results/videos",
        size: { width: this.viewportWidth, height: this.viewportHeight },
      };
    }

    this.context = await this.browser.newContext(contextOptions);

    if (this.tracingEnabled) {
      await this.context.tracing.start({
        screenshots: true,
        snapshots: true,
        sources: true,
      });
    }

    this.page = await this.context.newPage();

    Environment.setPageWidth(this.viewportWidth);
    Environment.setPageHeight(this.viewportHeight);

    console.log(
      `✅ Browser launched with storage state from ${storageStatePath}`
    );

    return this.page;
  }

  /**
   * Get current browser instance
   */
  public getBrowser(): Browser | null {
    return this.browser;
  }

  /**
   * Get current context
   */
  public getContext(): BrowserContext | null {
    return this.context;
  }

  /**
   * Get current page
   */
  public getPage(): Page | null {
    return this.page;
  }

  /**
   * Create a new page in the current context
   */
  public async newPage(): Promise<Page> {
    if (!this.context) {
      throw new Error("Browser context not initialized. Call launch() first.");
    }
    return await this.context.newPage();
  }

  /**
   * Save storage state for future sessions
   */
  public async saveStorageState(path: string): Promise<void> {
    if (!this.context) {
      throw new Error("Browser context not initialized. Call launch() first.");
    }
    await this.context.storageState({ path });
    console.log(`💾 Storage state saved to ${path}`);
  }

  /**
   * Stop tracing and save to file
   */
  public async stopTracing(path: string): Promise<void> {
    if (this.context && this.tracingEnabled) {
      await this.context.tracing.stop({ path });
      console.log(`📊 Trace saved to ${path}`);
    }
  }

  /**
   * Close browser and cleanup resources
   */
  public async close(): Promise<void> {
    console.log("🔄 Closing browser...");

    if (this.tracingEnabled && this.context) {
      try {
        await this.context.tracing.stop();
      } catch {
        // Tracing may already be stopped
      }
    }

    if (this.page) {
      await this.page.close().catch(() => {});
      this.page = null;
    }

    if (this.context) {
      await this.context.close().catch(() => {});
      this.context = null;
    }

    if (this.browser) {
      await this.browser.close().catch(() => {});
      this.browser = null;
    }

    console.log("✅ Browser closed");
  }

  /**
   * Take screenshot of current page
   */
  public async takeScreenshot(path?: string): Promise<Buffer | undefined> {
    if (!this.page) {
      console.warn("No page available for screenshot");
      return undefined;
    }
    return await this.page.screenshot({ path, fullPage: true });
  }

  /**
   * Grant clipboard permissions
   */
  public async grantClipboardPermissions(): Promise<void> {
    if (this.context) {
      await this.context.grantPermissions([
        "clipboard-read",
        "clipboard-write",
      ]);
    }
  }

  /**
   * Set HTTP credentials for basic auth
   */
  public async setHTTPCredentials(
    username: string,
    password: string
  ): Promise<void> {
    if (this.context) {
      await this.context.setHTTPCredentials({ username, password });
    }
  }

  /**
   * Add cookies to context
   */
  public async addCookies(
    cookies: Array<{
      name: string;
      value: string;
      domain: string;
      path?: string;
      expires?: number;
      httpOnly?: boolean;
      secure?: boolean;
      sameSite?: "Strict" | "Lax" | "None";
    }>
  ): Promise<void> {
    if (this.context) {
      await this.context.addCookies(cookies);
    }
  }

  /**
   * Get all cookies from context
   */
  public async getCookies(): Promise<
    Array<{
      name: string;
      value: string;
      domain: string;
      path: string;
      expires: number;
      httpOnly: boolean;
      secure: boolean;
      sameSite: "Strict" | "Lax" | "None";
    }>
  > {
    if (this.context) {
      return await this.context.cookies();
    }
    return [];
  }

  /**
   * Clear all cookies
   */
  public async clearCookies(): Promise<void> {
    if (this.context) {
      await this.context.clearCookies();
    }
  }

  /**
   * Execute JavaScript in the page context
   */
  public async evaluate<T>(fn: () => T | Promise<T>): Promise<T | undefined> {
    if (this.page) {
      return await this.page.evaluate(fn);
    }
    return undefined;
  }

  /**
   * Wait for navigation to complete
   */
  public async waitForNavigation(options?: {
    timeout?: number;
    waitUntil?: "load" | "domcontentloaded" | "networkidle";
  }): Promise<void> {
    if (this.page) {
      await this.page.waitForLoadState(options?.waitUntil || "load", {
        timeout: options?.timeout,
      });
    }
  }

  /**
   * Navigate to URL
   */
  public async goto(
    url: string,
    options?: {
      timeout?: number;
      waitUntil?: "load" | "domcontentloaded" | "networkidle";
    }
  ): Promise<void> {
    if (this.page) {
      await this.page.goto(url, options);
    }
  }
}
