// Native Cucumber bindings generated from: [SC-04] - Validate activity recommendations
import { Given, Then, When } from "@cucumber/cucumber";
import { Sc042ValidateSupportedActivitiesSteps } from "../Steps/SC-04.2-Validate_Supported_Activities.steps";

const steps = new Sc042ValidateSupportedActivitiesSteps();

Given("the user requests the forecast activity rankings for a valid city for supported activity validation", () =>
  steps.THE_USER_REQUESTS_THE_FORECAST_ACTIVITY_RANKINGS_FOR_SUPPORTED_ACTIVITIES_VALIDATION()
);

When("the API returns the supported activities response", () =>
  steps.THE_API_RETURNS_THE_SUPPORTED_ACTIVITIES_RESPONSE()
);

Then("validate that every forecast day contains all supported activities", () =>
  steps.VALIDATE_THAT_EVERY_FORECAST_DAY_CONTAINS_ALL_SUPPORTED_ACTIVITIES()
);
