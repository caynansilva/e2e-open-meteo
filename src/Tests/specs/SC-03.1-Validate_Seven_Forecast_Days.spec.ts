// Native Cucumber bindings generated from: [SC-03] - Validate forecast days
import { Given, Then, When } from "@cucumber/cucumber";
import { Sc031ValidateSevenForecastDaysSteps } from "../Steps/SC-03.1-Validate_Seven_Forecast_Days.steps";

const steps = new Sc031ValidateSevenForecastDaysSteps();

Given("the user sends a request for a valid city for the seven day forecast", () =>
    steps.THE_USER_SENDS_A_REQUEST_FOR_A_VALID_CITY_FOR_THE_SEVEN_DAY_FORECAST()
);

When("the API returns the seven day forecast response", () =>
    steps.THE_API_RETURNS_THE_SEVEN_DAY_FORECAST_RESPONSE()
);

Then("validate that the response contains exactly {int} forecast days", (expectedDays: number) => 
    steps.VALIDATE_THAT_THE_RESPONSE_CONTAINS_EXACTLY_INT_FORECAST_DAYS(expectedDays)
);
