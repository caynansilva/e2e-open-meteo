// Native Cucumber bindings generated from: [SC-05] - Validate activity ranking
import { Given, Then, When } from "@cucumber/cucumber";
import { Sc05ValidateActivityRankingSteps } from "../Steps/SC-05.1-Validate_Activity_Suitability_Score.steps";

const steps = new Sc05ValidateActivityRankingSteps(
);

Given("the user requests the forecast activity rankings for a valid city", () =>
    steps.THE_USER_REQUESTS_THE_FORECAST_ACTIVITY_RANKINGS_FOR_A_VALID_CITY()
);

When("the API returns the response", () =>
    steps.THE_API_RETURNS_THE_RESPONSE()
);

Then("validate that each forecast day contains a ranked list of activities", () =>
    steps.VALIDATE_THAT_EACH_FORECAST_DAY_CONTAINS_A_RANKED_LIST_OF_ACTIVITIES()
);

Then("validate that each activity has a suitability score between {int} and {int}", (expectedValue: number, expectedValue2: number) => 
    steps.VALIDATE_THAT_EACH_ACTIVITY_HAS_A_SUITABILITY_SCORE_BETWEEN_INT_AND_INT(expectedValue, expectedValue2)
);
