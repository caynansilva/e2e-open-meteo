// Native Cucumber bindings generated from: [SC-03] - Validate forecast days
import { Given, Then, When } from "@cucumber/cucumber";
import type { CucumberWorld } from "src/Support/CucumberWorld";
import { Sc032ValidateForecastStartDateSteps } from "../Steps/SC-03.2-Validate_Forecast_Start_Date.steps";

const steps = new Sc032ValidateForecastStartDateSteps();

Given("the user sends a request for a valid city for the forecast start date", function (this: CucumberWorld) {
  steps.THE_USER_SENDS_A_REQUEST_FOR_A_VALID_CITY_FOR_THE_FORECAST_START_DATE(this);
});

When("the API returns the forecast date response", function (this: CucumberWorld) {
  steps.THE_API_RETURNS_THE_FORECAST_DATE_RESPONSE(this);
});

Then("validate that the forecast starts from the next day", function (this: CucumberWorld) {
  steps.VALIDATE_THAT_THE_FORECAST_STARTS_FROM_THE_NEXT_DAY(this);
});

Then("validate that the current date is not included in the forecast", function (this: CucumberWorld) {
  steps.VALIDATE_THAT_THE_CURRENT_DATE_IS_NOT_INCLUDED_IN_THE_FORECAST(this);
});
