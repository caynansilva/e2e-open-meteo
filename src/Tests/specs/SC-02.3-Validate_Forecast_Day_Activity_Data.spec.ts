// Native Cucumber bindings generated from: [SC-02] - Validate the API response contract
import { Given, Then, When } from "@cucumber/cucumber";
import { Sc023ValidateForecastDayActivityDataSteps } from "../Steps/SC-02.3-Validate_Forecast_Day_Activity_Data.steps";

const steps = new Sc023ValidateForecastDayActivityDataSteps();

Given("the user requests the forecast activity rankings for a valid city for forecast activity data", () =>
    steps.THE_USER_REQUESTS_THE_FORECAST_ACTIVITY_RANKINGS_FOR_FORECAST_ACTIVITY_DATA()
);

When("the API returns the forecast activity data response", () =>
    steps.THE_API_RETURNS_THE_FORECAST_ACTIVITY_DATA_RESPONSE()
);

Then("validate that each forecast day contains the required activity data", () =>
    steps.VALIDATE_THAT_EACH_FORECAST_DAY_CONTAINS_THE_REQUIRED_ACTIVITY_DATA()
);
