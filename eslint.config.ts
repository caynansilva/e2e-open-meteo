import eslint from "@eslint/js";
import tseslint from "typescript-eslint";

/**
 * ESLint Configuration for Playwright E2E Framework
 * 
 * Uses the new flat config format (ESLint 9+)
 * Includes TypeScript support and recommended rules
 */
export default tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ["src/**/*.ts"],
    languageOptions: {
      parserOptions: {
        project: "./tsconfig.json",
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      // TypeScript specific rules
      "@typescript-eslint/no-unused-vars": [
        "warn",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/explicit-function-return-type": "off",
      "@typescript-eslint/explicit-module-boundary-types": "off",
      "@typescript-eslint/no-non-null-assertion": "warn",
      
      // General rules
      "no-console": "warn",
      "prefer-const": "error",
      "no-duplicate-imports": "error",
      
      // Playwright-specific allowances
      "@typescript-eslint/no-floating-promises": "off", // Playwright handles this
    },
  },
  {
    // Test file specific rules
    files: ["**/*.spec.ts", "**/*.test.ts", "**/e2e/**/*.ts"],
    rules: {
      "no-console": "off",
      "@typescript-eslint/no-explicit-any": "off",
    },
  },
  {
    // Ignore patterns
    ignores: [
      "node_modules/**",
      "dist/**",
      "test-results/**",
      "playwright-report/**",
      "cucumber.js",
      "eslint.config.ts",
      "playwright.config.*",
      "tools/**",
      "*.config.js",
    ],
  }
);
