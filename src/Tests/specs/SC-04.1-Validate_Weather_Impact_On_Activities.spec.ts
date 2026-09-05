// Native Cucumber bindings generated from: [SC-04] - Validate activity recommendations
import { Given, Then, When } from "@cucumber/cucumber";
import { Sc04ValidateActivityRecommendationsSteps } from "../Steps/SC-04.1-Validate_Weather_Impact_On_Activities.steps";

const steps = new Sc04ValidateActivityRecommendationsSteps(
);

Given("the user requests the forecast activity rankings for a valid city", () =>
    steps.THE_USER_REQUESTS_THE_FORECAST_ACTIVITY_RANKINGS_FOR_A_VALID_CITY()
);

When("the API returns the response", () =>
    steps.THE_API_RETURNS_THE_RESPONSE()
);

Then("validate that activity suitability is determined based on the weather conditions for each forecast day", () =>
    steps.VALIDATE_THAT_ACTIVITY_SUITABILITY_IS_DETERMINED_BASED_ON_THE_WEATHER_CONDITIONS_FOR_EACH_FORECAST_DAY()
);
