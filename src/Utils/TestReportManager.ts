import * as fs from "fs";
import * as path from "path";
import { AssertionLogger } from "./AssertionLogger";

/**
 * TestReportManager - Manages test execution reporting
 *
 * This singleton class handles:
 * - Test initialization and finalization
 * - Report folder structure creation
 * - Assertion summary generation
 * - HTML report generation
 * - Success rate calculation
 */
export class TestReportManager {
  private static instance: TestReportManager;
  private currentTestName: string = "";
  private currentTestFolder: string = "";
  private reportsBaseDir: string = "./test-results/reports";
  private screenshotsBaseDir: string = "./test-results/screenshots";

  private constructor() {}

  /**
   * Get singleton instance
   */
  public static getInstance(): TestReportManager {
    if (!TestReportManager.instance) {
      TestReportManager.instance = new TestReportManager();
    }
    return TestReportManager.instance;
  }

  /**
   * Configure base directories
   */
  public configure(options: {
    reportsBaseDir?: string;
    screenshotsBaseDir?: string;
  }): void {
    if (options.reportsBaseDir) this.reportsBaseDir = options.reportsBaseDir;
    if (options.screenshotsBaseDir)
      this.screenshotsBaseDir = options.screenshotsBaseDir;
  }

  /**
   * Initialize test - set up folders and reset logger
   */
  public initializeTest(testName: string): void {
    this.currentTestName = testName;
    const sanitizedName = this.sanitizeFileName(testName);
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");

    // Create test-specific folder
    this.currentTestFolder = path.join(
      this.reportsBaseDir,
      `${sanitizedName}_${timestamp}`
    );

    // Ensure directories exist
    this.ensureDirectoryExists(this.currentTestFolder);
    this.ensureDirectoryExists(this.screenshotsBaseDir);

    // Reset assertion logger for new test
    AssertionLogger.reset();

    console.log(`📝 Test initialized: ${testName}`);
    console.log(`📁 Report folder: ${this.currentTestFolder}`);
  }

  /**
   * Finalize test - generate reports and summaries
   */
  public async finalizeTest(
    status: "passed" | "failed" | "skipped"
  ): Promise<void> {
    const logger = AssertionLogger.getInstance();

    // Generate assertion summary
    const summary = logger.generateSummary();

    // Calculate success rate
    const total = summary.passed + summary.failed;
    const successRate =
      total > 0 ? ((summary.passed / total) * 100).toFixed(2) : "N/A";

    console.log(`\n📊 Test Summary for: ${this.currentTestName}`);
    console.log(`   Status: ${status.toUpperCase()}`);
    console.log(`   Assertions Passed: ${summary.passed}`);
    console.log(`   Assertions Failed: ${summary.failed}`);
    console.log(`   Success Rate: ${successRate}%`);

    // Save JSON report
    const reportData = {
      testName: this.currentTestName,
      status,
      timestamp: new Date().toISOString(),
      assertions: {
        passed: summary.passed,
        failed: summary.failed,
        total,
        successRate: `${successRate}%`,
      },
      details: logger.getResults(),
    };

    const jsonReportPath = path.join(this.currentTestFolder, "report.json");
    fs.writeFileSync(jsonReportPath, JSON.stringify(reportData, null, 2));

    // Generate HTML report
    await this.generateHTMLReport(reportData);

    // Print assertion details
    logger.printSummaryReport();

    console.log(`✅ Test finalized: ${this.currentTestName}`);
  }

  /**
   * Get current test folder path
   */
  public getCurrentTestFolder(): string {
    return this.currentTestFolder;
  }

  /**
   * Get screenshots directory path
   */
  public getScreenshotsDir(): string {
    return this.screenshotsBaseDir;
  }

  /**
   * Generate HTML report from test data
   */
  private async generateHTMLReport(reportData: any): Promise<void> {
    const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Test Report - ${reportData.testName}</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            line-height: 1.6;
            padding: 20px;
            background: #f5f5f5;
            color: #333;
        }
        .container {
            max-width: 1200px;
            margin: 0 auto;
        }
        header {
            background: linear-gradient(135deg, #4B286D, #6B3A9D);
            color: white;
            padding: 30px;
            border-radius: 12px;
            margin-bottom: 20px;
        }
        h1 {
            font-size: 24px;
            margin-bottom: 10px;
        }
        .meta {
            font-size: 14px;
            opacity: 0.9;
        }
        .summary-cards {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
            margin-bottom: 20px;
        }
        .card {
            background: white;
            border-radius: 12px;
            padding: 20px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
        .card h3 {
            font-size: 14px;
            color: #666;
            margin-bottom: 8px;
        }
        .card .value {
            font-size: 32px;
            font-weight: bold;
        }
        .card.passed .value { color: #22c55e; }
        .card.failed .value { color: #ef4444; }
        .card.rate .value { color: #4B286D; }
        .status {
            display: inline-block;
            padding: 4px 12px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: 600;
            text-transform: uppercase;
        }
        .status.passed { background: #dcfce7; color: #15803d; }
        .status.failed { background: #fee2e2; color: #b91c1c; }
        .status.skipped { background: #fef3c7; color: #92400e; }
        .assertions {
            background: white;
            border-radius: 12px;
            padding: 20px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
        .assertions h2 {
            margin-bottom: 20px;
            font-size: 18px;
        }
        .assertion-item {
            padding: 12px;
            border-radius: 8px;
            margin-bottom: 10px;
            border-left: 4px solid;
        }
        .assertion-item.passed {
            background: #f0fdf4;
            border-color: #22c55e;
        }
        .assertion-item.failed {
            background: #fef2f2;
            border-color: #ef4444;
        }
        .assertion-message {
            font-weight: 500;
            margin-bottom: 4px;
        }
        .assertion-meta {
            font-size: 12px;
            color: #666;
        }
        .assertion-values {
            margin-top: 8px;
            font-size: 12px;
            background: rgba(0,0,0,0.05);
            padding: 8px;
            border-radius: 4px;
        }
        .screenshot {
            margin-top: 10px;
        }
        .screenshot img {
            max-width: 100%;
            border-radius: 8px;
            border: 1px solid #ddd;
        }
    </style>
</head>
<body>
    <div class="container">
        <header>
            <h1>${reportData.testName}</h1>
            <div class="meta">
                <span class="status ${reportData.status}">${reportData.status}</span>
                <span style="margin-left: 15px;">📅 ${new Date(reportData.timestamp).toLocaleString()}</span>
            </div>
        </header>

        <div class="summary-cards">
            <div class="card passed">
                <h3>Passed Assertions</h3>
                <div class="value">${reportData.assertions.passed}</div>
            </div>
            <div class="card failed">
                <h3>Failed Assertions</h3>
                <div class="value">${reportData.assertions.failed}</div>
            </div>
            <div class="card rate">
                <h3>Success Rate</h3>
                <div class="value">${reportData.assertions.successRate}</div>
            </div>
        </div>

        <div class="assertions">
            <h2>Assertion Details</h2>
            ${reportData.details
              .map(
                (a: any) => `
                <div class="assertion-item ${a.passed ? "passed" : "failed"}">
                    <div class="assertion-message">${a.passed ? "✅" : "❌"} ${a.message}</div>
                    <div class="assertion-meta">
                        ${a.selector ? `📍 Selector: ${a.selector}` : ""}
                    </div>
                    ${
                      !a.passed && (a.expected || a.actual)
                        ? `
                        <div class="assertion-values">
                            <strong>Expected:</strong> ${a.expected || "N/A"}<br>
                            <strong>Actual:</strong> ${a.actual || "N/A"}
                        </div>
                    `
                        : ""
                    }
                    ${
                      a.screenshotPath
                        ? `
                        <div class="screenshot">
                            <img src="${a.screenshotPath}" alt="Failure screenshot">
                        </div>
                    `
                        : ""
                    }
                </div>
            `
              )
              .join("")}
        </div>
    </div>
</body>
</html>
    `.trim();

    const htmlReportPath = path.join(this.currentTestFolder, "report.html");
    fs.writeFileSync(htmlReportPath, html);
    console.log(`📄 HTML report generated: ${htmlReportPath}`);
  }

  /**
   * Sanitize file name for safe file system usage
   */
  private sanitizeFileName(name: string): string {
    return name
      .replace(/[^a-zA-Z0-9-_]/g, "_")
      .replace(/_+/g, "_")
      .substring(0, 100);
  }

  /**
   * Ensure directory exists, create if not
   */
  private ensureDirectoryExists(dirPath: string): void {
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }
  }

  /**
   * Generate consolidated report for multiple tests
   */
  public generateConsolidatedReport(
    testResults: Array<{
      testName: string;
      status: "passed" | "failed" | "skipped";
      assertions: { passed: number; failed: number };
      duration?: number;
    }>
  ): void {
    const totalPassed = testResults.filter(t => t.status === "passed").length;
    const totalFailed = testResults.filter(t => t.status === "failed").length;
    const totalSkipped = testResults.filter(t => t.status === "skipped").length;
    const totalTests = testResults.length;

    const consolidatedReport = {
      timestamp: new Date().toISOString(),
      summary: {
        total: totalTests,
        passed: totalPassed,
        failed: totalFailed,
        skipped: totalSkipped,
        passRate:
          totalTests > 0
            ? ((totalPassed / totalTests) * 100).toFixed(2) + "%"
            : "N/A",
      },
      tests: testResults,
    };

    const reportPath = path.join(
      this.reportsBaseDir,
      "consolidated-report.json"
    );
    fs.writeFileSync(reportPath, JSON.stringify(consolidatedReport, null, 2));

    console.log(`\n📊 Consolidated Report Generated`);
    console.log(`   Total Tests: ${totalTests}`);
    console.log(`   Passed: ${totalPassed}`);
    console.log(`   Failed: ${totalFailed}`);
    console.log(`   Skipped: ${totalSkipped}`);
    console.log(`   Pass Rate: ${consolidatedReport.summary.passRate}`);
    console.log(`   Report: ${reportPath}`);
  }
}
