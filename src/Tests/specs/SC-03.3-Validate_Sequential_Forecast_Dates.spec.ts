// Native Cucumber bindings generated from: [SC-03] - Validate forecast days
import { Given, Then, When } from "@cucumber/cucumber";
import { Sc033ValidateSequentialForecastDatesSteps } from "../Steps/SC-03.3-Validate_Sequential_Forecast_Dates.steps";

const steps = new Sc033ValidateSequentialForecastDatesSteps();

Given("the user sends a request for a valid city", () =>
    steps.THE_USER_SENDS_A_REQUEST_FOR_A_VALID_CITY()
);

When("the API returns the response", () =>
    steps.THE_API_RETURNS_THE_RESPONSE()
);

Then("validate that the forecast dates are sequential", () =>
    steps.VALIDATE_THAT_THE_FORECAST_DATES_ARE_SEQUENTIAL()
);

Then("validate that there are no missing or duplicated forecast days", () =>
    steps.VALIDATE_THAT_THERE_ARE_NO_MISSING_OR_DUPLICATED_FORECAST_DAYS()
);
