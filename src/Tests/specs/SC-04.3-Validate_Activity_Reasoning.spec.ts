// Native Cucumber bindings generated from: [SC-04] - Validate activity recommendations
import { Given, Then, When } from "@cucumber/cucumber";
import { Sc043ValidateActivityReasoningSteps } from "../Steps/SC-04.3-Validate_Activity_Reasoning.steps";

const steps = new Sc043ValidateActivityReasoningSteps();

Given("the user requests the forecast activity rankings for a valid city for activity reasoning validation", () =>
    steps.THE_USER_REQUESTS_THE_FORECAST_ACTIVITY_RANKINGS_FOR_ACTIVITY_REASONING_VALIDATION()
);

When("the API returns the activity reasoning response", () =>
    steps.THE_API_RETURNS_THE_ACTIVITY_REASONING_RESPONSE()
);

Then("validate that every activity includes reasoning explaining its suitability", () =>
    steps.VALIDATE_THAT_EVERY_ACTIVITY_INCLUDES_REASONING_EXPLAINING_ITS_SUITABILITY()
);
