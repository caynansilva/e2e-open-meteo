// Native Cucumber bindings generated from: [SC-05] - Validate activity ranking
import { Given, Then, When } from "@cucumber/cucumber";
import { Sc051ValidateActivitySuitabilityScoreSteps } from "../Steps/SC-05.1-Validate_Activity_Suitability_Score.steps";

const steps = new Sc051ValidateActivitySuitabilityScoreSteps();

Given("the user requests the forecast activity rankings for a valid city for ranked activity list validation", () =>
  steps.THE_USER_REQUESTS_THE_FORECAST_ACTIVITY_RANKINGS_FOR_RANKED_ACTIVITY_LIST_VALIDATION()
);

When("the API returns the ranked activity list response", () =>
  steps.THE_API_RETURNS_THE_RANKED_ACTIVITY_LIST_RESPONSE()
);

Then("validate that each forecast day contains a ranked list of activities", () =>
  steps.VALIDATE_THAT_EACH_FORECAST_DAY_CONTAINS_A_RANKED_LIST_OF_ACTIVITIES()
);

Then("validate that each activity has a suitability score between {int} and {int}", (
  expectedMinimum: number,
  expectedMaximum: number
) =>
  steps.VALIDATE_THAT_EACH_ACTIVITY_HAS_A_SUITABILITY_SCORE_BETWEEN_INT_AND_INT(
    expectedMinimum,
    expectedMaximum
  )
);
