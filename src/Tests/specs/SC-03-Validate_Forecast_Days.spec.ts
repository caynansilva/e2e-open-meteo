// Native Cucumber bindings generated from: [SC-03] - Validate forecast days
import { Given, Then } from "@cucumber/cucumber";
import { Sc03ValidateForecastDaysSteps } from "../Steps/SC-03-Validate_Forecast_Days.steps";

const steps = new Sc03ValidateForecastDaysSteps();

Given("the user sends a request for a valid city", () =>
    steps.THE_USER_SENDS_A_REQUEST_FOR_A_VALID_CITY()
);

Then("validate that the response contains exactly {int} forecast days", (expectedDays: number) =>
    steps.VALIDATE_THAT_THE_RESPONSE_CONTAINS_EXACTLY_INT_FORECAST_DAYS(expectedDays)
);

Then("validate that the forecast starts from the next day", () =>
    steps.VALIDATE_THAT_THE_FORECAST_STARTS_FROM_THE_NEXT_DAY()
);

Then("validate that the current date is not included in the forecast", () =>
    steps.VALIDATE_THAT_THE_CURRENT_DATE_IS_NOT_INCLUDED_IN_THE_FORECAST()
);

Then("validate that the forecast dates are sequential", () =>
    steps.VALIDATE_THAT_THE_FORECAST_DATES_ARE_SEQUENTIAL()
);

Then("validate that there are no missing or duplicated forecast days", () =>
    steps.VALIDATE_THAT_THERE_ARE_NO_MISSING_OR_DUPLICATED_FORECAST_DAYS()
);
