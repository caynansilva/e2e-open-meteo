import dotenv from "dotenv";

dotenv.config();

/**
 * Environment - Configuration and environment variable management
 *
 * This class provides centralized access to environment-specific configuration:
 * - Base URLs for different environments
 * - Authentication credentials
 * - API endpoints
 * - Browser settings
 *
 * Customize the environment variables based on your project's needs.
 */
export class Environment {
  /**
   * Get the current test environment
   */
  public static getEnvironment(): string {
    return process.env.TEST_ENVIRONMENT || "local";
  }

  /**
   * Get environment from Playwright project or fallback to TEST_ENVIRONMENT
   */
  public static getCurrentEnvironment(): string {
    const playwrightProject = process.env.PLAYWRIGHT_PROJECT || "";
    if (playwrightProject) {
      const environment = playwrightProject.split("-")[0];
      if (
        environment &&
        ["local", "dev", "staging", "prod"].includes(environment)
      ) {
        return environment.toUpperCase();
      }
    }
    return process.env.TEST_ENVIRONMENT || "LOCAL";
  }

  /**
   * Set the current environment
   */
  public static setCurrentEnvironment(environment: string): void {
    process.env.TEST_ENVIRONMENT = environment;
  }

  // ========================================
  // Base URLs - Customize for your project
  // ========================================

  public static getBaseUrl(): string {
    switch (this.getCurrentEnvironment().toUpperCase()) {
      case "DEV":
        return process.env.APP_DEV_URL || "";
      case "STAGING":
        return process.env.APP_STAGING_URL || "";
      case "PROD":
        return process.env.APP_PROD_URL || "";
      case "LOCAL":
      default:
        return process.env.APP_LOCAL_URL || "http://localhost:3000";
    }
  }

  public static getLocalUrl(): string {
    return process.env.APP_LOCAL_URL || "http://localhost:3000";
  }

  public static getDevUrl(): string {
    return process.env.APP_DEV_URL || "";
  }

  public static getStagingUrl(): string {
    return process.env.APP_STAGING_URL || "";
  }

  public static getProdUrl(): string {
    return process.env.APP_PROD_URL || "";
  }

  // ========================================
  // API URLs - Customize for your project
  // ========================================

  public static getApiUrl(): string {
    switch (this.getCurrentEnvironment().toUpperCase()) {
      case "DEV":
        return process.env.API_DEV_URL || "";
      case "STAGING":
        return process.env.API_STAGING_URL || "";
      case "PROD":
        return process.env.API_PROD_URL || "";
      case "LOCAL":
      default:
        return process.env.API_LOCAL_URL || "https://api.open-meteo.com";
    }
  }

  public static getGeocodingApiUrl(): string {
    return process.env.GEOCODING_API_URL || "https://geocoding-api.open-meteo.com";
  }

  public static getApiKey(): string {
    return process.env.API_KEY || "";
  }

  public static getApiSecret(): string {
    return process.env.API_SECRET || "";
  }

  public static getApiToken(): string {
    return process.env.API_TOKEN || "";
  }

  // ========================================
  // Authentication Credentials
  // ========================================

  public static getUserName(): string {
    return process.env.USER_NAME || "";
  }

  public static getPassword(): string {
    return process.env.PASSWORD || "";
  }

  public static getEmail(): string {
    return process.env.EMAIL || "";
  }

  public static getStagingUserName(): string {
    return process.env.STAGING_USER_NAME || "";
  }

  public static getStagingPassword(): string {
    return process.env.STAGING_PASSWORD || "";
  }

  public static getProductionUserName(): string {
    return process.env.PROD_USER_NAME || "";
  }

  public static getProductionPassword(): string {
    return process.env.PROD_PASSWORD || "";
  }

  public static getDevelopmentUserName(): string {
    return process.env.DEV_USER_NAME || "";
  }

  public static getDevelopmentPassword(): string {
    return process.env.DEV_PASSWORD || "";
  }

  // ========================================
  // Browser Settings
  // ========================================

  public static getPageWidth(): number {
    return parseInt(process.env.BROWSER_PAGE_WIDTH || "1920");
  }

  public static getPageHeight(): number {
    return parseInt(process.env.BROWSER_PAGE_HEIGHT || "1080");
  }

  public static setPageWidth(width: number): void {
    process.env.BROWSER_PAGE_WIDTH = width.toString();
  }

  public static setPageHeight(height: number): void {
    process.env.BROWSER_PAGE_HEIGHT = height.toString();
  }

  // ========================================
  // SSO/Login URLs
  // ========================================

  public static getSSOLoginUrl(): string {
    switch (this.getCurrentEnvironment().toUpperCase()) {
      case "DEV":
        return process.env.SSO_DEV_URL || "";
      case "STAGING":
        return process.env.SSO_STAGING_URL || "";
      case "PROD":
        return process.env.SSO_PROD_URL || "";
      case "LOCAL":
      default:
        return process.env.SSO_LOCAL_URL || "";
    }
  }

  // ========================================
  // Application Routes - Customize for your project
  // ========================================

  public static getRouteDashboard(): string {
    return process.env.ROUTE_DASHBOARD || "/";
  }

  public static getRouteLogin(): string {
    return process.env.ROUTE_LOGIN || "/login";
  }

  public static getRouteSettings(): string {
    return process.env.ROUTE_SETTINGS || "/settings";
  }

  // ========================================
  // Debug and Utility Methods
  // ========================================

  /**
   * Get environment info for logging/debugging
   */
  public static getEnvironmentInfo(): string {
    const env = this.getCurrentEnvironment();
    const baseUrl = this.getBaseUrl();
    const projectName = process.env.PLAYWRIGHT_PROJECT || "Not set";
    const envVar = process.env.TEST_ENVIRONMENT || "Not set";

    return `Environment: ${env}, Base URL: ${baseUrl}, Project: ${projectName}, Env Var: ${envVar}`;
  }

  /**
   * Debug method to show environment detection details
   */
  public static debugEnvironmentDetection(): void {
    console.log("🔍 Environment Detection Debug:");
    console.log(
      `  PLAYWRIGHT_PROJECT: ${process.env.PLAYWRIGHT_PROJECT || "Not set"}`
    );
    console.log(
      `  TEST_ENVIRONMENT: ${process.env.TEST_ENVIRONMENT || "Not set"}`
    );
    console.log(`  process.argv: ${JSON.stringify(process.argv)}`);

    const playwrightProject = process.env.PLAYWRIGHT_PROJECT || "";
    if (playwrightProject) {
      const environment = playwrightProject.split("-")[0];
      console.log(`  Extracted from PLAYWRIGHT_PROJECT: ${environment}`);
    }

    console.log(
      `  Final Detected Environment: ${this.getCurrentEnvironment()}`
    );
    console.log(`  Base URL: ${this.getBaseUrl()}`);
  }

  public static getCurrentEnvironmentFromPlaywright(): string {
    return process.env.PLAYWRIGHT_PROJECT || "";
  }

  public static setCurrentEnvironmentFromPlaywright(environment: string): void {
    process.env.PLAYWRIGHT_PROJECT = environment;
  }
}
