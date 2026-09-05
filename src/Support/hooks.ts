import { Before } from "@cucumber/cucumber";
import { CucumberWorld } from "./CucumberWorld";

Before(function (this: CucumberWorld, scenario) {
  this.clearData();
  this.setData("scenarioName", scenario.pickle.name);
  this.setData("scenarioStartTime", Date.now());
});
