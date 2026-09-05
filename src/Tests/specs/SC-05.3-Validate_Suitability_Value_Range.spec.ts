// Native Cucumber bindings generated from: [SC-05] - Validate activity ranking
import { Given, Then, When } from "@cucumber/cucumber";
import type { CucumberWorld } from "src/Support/CucumberWorld";
import { Sc053ValidateSuitabilityValueRangeSteps } from "../Steps/SC-05.3-Validate_Suitability_Value_Range.steps";

const steps = new Sc053ValidateSuitabilityValueRangeSteps();

Given("the user requests the forecast activity rankings for a valid city for suitability range validation", function (this: CucumberWorld) {
  steps.THE_USER_REQUESTS_THE_FORECAST_ACTIVITY_RANKINGS_FOR_SUITABILITY_RANGE_VALIDATION(this);
});

When("the API returns the suitability range response", function (this: CucumberWorld) {
  steps.THE_API_RETURNS_THE_SUITABILITY_RANGE_RESPONSE(this);
});

Then("validate that all activity suitability values are between {int} and {int}", function (this: CucumberWorld, expectedMinimum: number, expectedMaximum: number) {
  steps.VALIDATE_THAT_ALL_ACTIVITY_SUITABILITY_VALUES_ARE_BETWEEN_INT_AND_INT(this, expectedMinimum, expectedMaximum);
});
