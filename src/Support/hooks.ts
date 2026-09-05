import { Before } from "@cucumber/cucumber";

Before(function (scenario) {
  console.log("----------------------------------------------");
  console.log(`Starting tests for Scenario: ${scenario.pickle.name}`);
  console.log("----------------------------------------------");
});
