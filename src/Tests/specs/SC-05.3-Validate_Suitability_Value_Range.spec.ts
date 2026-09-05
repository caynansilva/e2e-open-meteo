// Native Cucumber bindings generated from: [SC-05] - Validate activity ranking
import { Given, Then, When } from "@cucumber/cucumber";
import { Sc05ValidateActivityRankingSteps } from "../Steps/SC-05.3-Validate_Suitability_Value_Range.steps";

const steps = new Sc05ValidateActivityRankingSteps();

Given("the user requests the forecast activity rankings for a valid city", () =>
    steps.THE_USER_REQUESTS_THE_FORECAST_ACTIVITY_RANKINGS_FOR_A_VALID_CITY()
);

When("the API returns the response", () =>
    steps.THE_API_RETURNS_THE_RESPONSE()
);

Then("validate that all activity suitability values are between {int} and {int}", (expectedValue: number, expectedValue2: number) => 
    steps.VALIDATE_THAT_ALL_ACTIVITY_SUITABILITY_VALUES_ARE_BETWEEN_INT_AND_INT(expectedValue, expectedValue2)
);
