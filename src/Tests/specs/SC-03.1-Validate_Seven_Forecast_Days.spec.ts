// Native Cucumber bindings generated from: [SC-03] - Validate forecast days
import { Given, Then, When } from "@cucumber/cucumber";
import type { CucumberWorld } from "src/Support/CucumberWorld";
import { Sc031ValidateSevenForecastDaysSteps } from "../Steps/SC-03.1-Validate_Seven_Forecast_Days.steps";

const steps = new Sc031ValidateSevenForecastDaysSteps();

Given("the user sends a request for a valid city for the seven day forecast", function (this: CucumberWorld) {
  steps.THE_USER_SENDS_A_REQUEST_FOR_A_VALID_CITY_FOR_THE_SEVEN_DAY_FORECAST(this);
});

When("the API returns the seven day forecast response", function (this: CucumberWorld) {
  steps.THE_API_RETURNS_THE_SEVEN_DAY_FORECAST_RESPONSE(this);
});

Then("validate that the response contains exactly {int} forecast days", function (this: CucumberWorld, expectedDays: number) {
  steps.VALIDATE_THAT_THE_RESPONSE_CONTAINS_EXACTLY_INT_FORECAST_DAYS(this, expectedDays);
});
