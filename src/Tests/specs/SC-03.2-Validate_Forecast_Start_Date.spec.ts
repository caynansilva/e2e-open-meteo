// Native Cucumber bindings generated from: [SC-03] - Validate forecast days
import { Given, Then, When } from "@cucumber/cucumber";
import { Sc032ValidateForecastStartDateSteps } from "../Steps/SC-03.2-Validate_Forecast_Start_Date.steps";

const steps = new Sc032ValidateForecastStartDateSteps();

Given("the user sends a request for a valid city", () =>
    steps.THE_USER_SENDS_A_REQUEST_FOR_A_VALID_CITY()
);

When("the API returns the response", () =>
    steps.THE_API_RETURNS_THE_RESPONSE()
);

Then("validate that the forecast starts from the next day", () =>
    steps.VALIDATE_THAT_THE_FORECAST_STARTS_FROM_THE_NEXT_DAY()
);

Then("validate that the current date is not included in the forecast", () =>
    steps.VALIDATE_THAT_THE_CURRENT_DATE_IS_NOT_INCLUDED_IN_THE_FORECAST()
);
