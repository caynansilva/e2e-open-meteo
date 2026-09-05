// Native Cucumber bindings generated from: [SC-03] - Validate forecast days
import { Given, Then, When } from "@cucumber/cucumber";
import type { CucumberWorld } from "src/Support/CucumberWorld";
import { Sc033ValidateSequentialForecastDatesSteps } from "../Steps/SC-03.3-Validate_Sequential_Forecast_Dates.steps";

const steps = new Sc033ValidateSequentialForecastDatesSteps();

Given("the user sends a request for a valid city for sequential forecast dates", function (this: CucumberWorld) {
  steps.THE_USER_SENDS_A_REQUEST_FOR_A_VALID_CITY_FOR_SEQUENTIAL_FORECAST_DATES(this);
});

When("the API returns the sequential forecast response", function (this: CucumberWorld) {
  steps.THE_API_RETURNS_THE_SEQUENTIAL_FORECAST_RESPONSE(this);
});

Then("validate that the forecast dates are sequential", function (this: CucumberWorld) {
  steps.VALIDATE_THAT_THE_FORECAST_DATES_ARE_SEQUENTIAL(this);
});

Then("validate that there are no missing or duplicated forecast days", function (this: CucumberWorld) {
  steps.VALIDATE_THAT_THERE_ARE_NO_MISSING_OR_DUPLICATED_FORECAST_DAYS(this);
});
