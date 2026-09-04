import { After, Before, BeforeAll, Status } from "@cucumber/cucumber";
import * as fs from "fs";
import * as path from "path";
import { CucumberWorld } from "./CucumberWorld";

const SCREENSHOTS_DIR = "./test-results/cucumber-screenshots";

BeforeAll(function () {
  fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });
});

Before(function (this: CucumberWorld, scenario) {
  this.setData("scenarioName", scenario.pickle.name);
  this.setData("scenarioStartTime", Date.now());
});

Before({ tags: "@ui" }, async function (this: CucumberWorld) {
  await this.initBrowser({
    browserType: "chromium",
    headless: process.env.HEADLESS !== "false",
    viewportWidth: Number(process.env.VIEWPORT_WIDTH ?? "1920"),
    viewportHeight: Number(process.env.VIEWPORT_HEIGHT ?? "1080"),
    storageStatePath: process.env.STORAGE_STATE_PATH
  });
});

After({ tags: "@ui" }, async function (this: CucumberWorld, scenario) {
  await captureFailureScreenshot(
    this,
    scenario.pickle.name,
    scenario.result?.status
  );
  await this.closeBrowser();
});

async function captureFailureScreenshot(
  world: CucumberWorld,
  scenarioName: string,
  status?: (typeof Status)[keyof typeof Status]
): Promise<void> {
  if (status !== Status.FAILED || !world.hasBrowser()) {
    return;
  }

  const fileName = `${sanitizeScenarioName(scenarioName)}-${Date.now()}.png`;
  const screenshot = await world.takeScreenshot(path.join(SCREENSHOTS_DIR, fileName));

  if (screenshot) {
    await world.attach(screenshot, "image/png");
  }
}

function sanitizeScenarioName(scenarioName: string): string {
  return scenarioName.replace(/[^a-zA-Z0-9-_]/g, "_");
}
