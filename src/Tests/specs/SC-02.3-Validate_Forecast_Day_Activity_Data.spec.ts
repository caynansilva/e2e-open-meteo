// Native Cucumber bindings generated from: [SC-02] - Validate the API response contract
import { Given, Then, When } from "@cucumber/cucumber";
import { Sc02ValidateTheApiResponseContractSteps } from "../Steps/SC-02.3-Validate_Forecast_Day_Activity_Data.steps";

const steps = new Sc02ValidateTheApiResponseContractSteps();

Given("the user requests the forecast activity rankings for a valid city", () =>
    steps.THE_USER_REQUESTS_THE_FORECAST_ACTIVITY_RANKINGS_FOR_A_VALID_CITY()
);

When("the API returns the response", () =>
    steps.THE_API_RETURNS_THE_RESPONSE()
);

Then("validate that each forecast day contains the required activity data", () =>
    steps.VALIDATE_THAT_EACH_FORECAST_DAY_CONTAINS_THE_REQUIRED_ACTIVITY_DATA()
);
