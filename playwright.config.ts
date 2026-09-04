import { defineConfig, devices } from "@playwright/test";
import * as dotenv from "dotenv";
import * as path from "path";

/**
 * Playwright Configuration Template
 * 
 * This configuration provides:
 * - Multi-browser testing (Chromium, Firefox, WebKit)
 * - Environment-based configurations (local, dev, staging, prod)
 * - Authentication state management
 * - Reporting options (HTML, JSON, console)
 * - Parallel test execution
 * 
 * Customize this file for your project's specific needs.
 */

// Load environment variables
const envFile = process.env.ENV_FILE || ".env.local";
dotenv.config({ path: path.resolve(process.cwd(), envFile) });

// Environment configuration
const isCI = !!process.env.CI;
const environment = process.env.TEST_ENV || "local";
const storageStatePath = `./storageState-${environment}.json`;

// Base URLs per environment
const baseUrls: Record<string, string> = {
  local: "http://localhost:3000",
  dev: process.env.DEV_URL || "https://dev.example.com",
  staging: process.env.STAGING_URL || "https://staging.example.com",
  prod: process.env.PROD_URL || "https://www.example.com",
};

export default defineConfig({
  // Test directory
  testDir: "./src/Tests",
  
  // Test file pattern
  testMatch: "**/*.spec.ts",

  // Native Cucumber bindings also use the .spec.ts suffix; Playwright must ignore them.
  testIgnore: "**/specs/**/*.spec.ts",
  
  // Timeout configuration
  timeout: 60000,
  expect: {
    timeout: 10000,
  },
  
  // Parallel execution
  fullyParallel: true,
  workers: isCI ? 2 : 4,
  
  // Retry failed tests
  retries: isCI ? 2 : 0,
  
  // Fail fast in CI
  maxFailures: isCI ? 10 : 0,
  
  // Reporter configuration
  reporter: [
    ["list"],
    ["html", { outputFolder: "./test-results/html-report", open: "never" }],
    ["json", { outputFile: "./test-results/test-results.json" }],
  ],
  
  // Output directories
  outputDir: "./test-results/artifacts",
  snapshotDir: "./test-results/snapshots",
  
  // Global setup/teardown (optional)
  // globalSetup: './global-setup.ts',
  // globalTeardown: './global-teardown.ts',
  
  // Use shared configuration across all projects
  use: {
    // Base URL
    baseURL: baseUrls[environment],
    
    // Browser options
    headless: isCI || process.env.HEADLESS !== "false",
    viewport: { width: 1920, height: 1080 },
    ignoreHTTPSErrors: true,
    
    // Artifacts on failure
    screenshot: "only-on-failure",
    video: "retain-on-failure",
    trace: "retain-on-failure",
    
    // Timeouts
    actionTimeout: 30000,
    navigationTimeout: 30000,
    
    // Locale and timezone
    locale: "en-US",
    timezoneId: "America/New_York",
  },
  
  // Browser projects
  projects: [
    // ============================================
    // Setup Project - Authentication
    // ============================================
    {
      name: "setup",
      testMatch: /.*\.setup\.ts/,
      use: {
        ...devices["Desktop Chrome"],
      },
    },
    
    // ============================================
    // Chromium Projects
    // ============================================
    {
      name: "chromium",
      use: {
        ...devices["Desktop Chrome"],
        // storageState: storageStatePath, // Uncomment when auth setup is added
      },
      // dependencies: ["setup"], // Uncomment when auth.setup.ts is added to e2e-specs
    },
    {
      name: "chromium-no-auth",
      use: {
        ...devices["Desktop Chrome"],
      },
    },
    
    // ============================================
    // Firefox Projects
    // ============================================
    {
      name: "firefox",
      use: {
        ...devices["Desktop Firefox"],
        // storageState: storageStatePath,
      },
      // dependencies: ["setup"],
    },
    
    // ============================================
    // WebKit Projects
    // ============================================
    {
      name: "webkit",
      use: {
        ...devices["Desktop Safari"],
        // storageState: storageStatePath,
      },
      // dependencies: ["setup"],
    },
    
    // ============================================
    // Mobile Projects
    // ============================================
    {
      name: "mobile-chrome",
      use: {
        ...devices["Pixel 5"],
        // storageState: storageStatePath,
      },
      // dependencies: ["setup"],
    },
    {
      name: "mobile-safari",
      use: {
        ...devices["iPhone 12"],
        // storageState: storageStatePath,
      },
      // dependencies: ["setup"],
    },
    
    // ============================================
    // Environment-Specific Projects
    // ============================================
    {
      name: "local",
      use: {
        ...devices["Desktop Chrome"],
        baseURL: baseUrls.local,
      },
    },
    {
      name: "dev",
      use: {
        ...devices["Desktop Chrome"],
        baseURL: baseUrls.dev,
        storageState: "./storageState-dev.json",
      },
    },
    {
      name: "staging",
      use: {
        ...devices["Desktop Chrome"],
        baseURL: baseUrls.staging,
        storageState: "./storageState-staging.json",
      },
    },
    {
      name: "prod",
      use: {
        ...devices["Desktop Chrome"],
        baseURL: baseUrls.prod,
        storageState: "./storageState-prod.json",
      },
    },
  ],
  
  // Web server configuration (for local development)
  // Uncomment and configure when you have a local dev server to start
  // webServer: environment === "local" ? {
  //   command: "npm run dev",
  //   url: baseUrls.local,
  //   reuseExistingServer: !isCI,
  //   timeout: 120000,
  // } : undefined,
});
