// Native Cucumber bindings generated from: [SC-05] - Validate activity ranking
import { Given, Then, When } from "@cucumber/cucumber";
import type { CucumberWorld } from "src/Support/CucumberWorld";
import { Sc052ValidateActivityRankingOrderSteps } from "../Steps/SC-05.2-Validate_Activity_Ranking_Order.steps";

const steps = new Sc052ValidateActivityRankingOrderSteps();

Given("the user requests the forecast activity rankings for a valid city for ranking order validation", function (this: CucumberWorld) {
  steps.THE_USER_REQUESTS_THE_FORECAST_ACTIVITY_RANKINGS_FOR_RANKING_ORDER_VALIDATION(this);
});

When("the API returns the ordered rankings response", async function (this: CucumberWorld) {
  await steps.THE_API_RETURNS_THE_ORDERED_RANKINGS_RESPONSE(this);
});

Then("validate that the activities for each forecast day are ordered from highest to lowest suitability", function (this: CucumberWorld) {
  steps.VALIDATE_THAT_THE_ACTIVITIES_FOR_EACH_FORECAST_DAY_ARE_ORDERED_FROM_HIGHEST_TO_LOWEST_SUITABILITY(this);
});
