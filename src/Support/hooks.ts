import { Before } from "@cucumber/cucumber";
import { CucumberWorld, WORLD_DATA_KEYS } from "./CucumberWorld";

Before(function (this: CucumberWorld, scenario) {
  this.clearData();
  this.setData(WORLD_DATA_KEYS.scenarioName, scenario.pickle.name);
  this.setData(WORLD_DATA_KEYS.scenarioStartTime, Date.now());

  console.log("----------------------------------------------");
  console.log(`Starting tests for Scenario: ${scenario.pickle.name}`);
  console.log("----------------------------------------------");
});
