// Native Cucumber bindings generated from: [SC-04] - Validate activity recommendations
import { Then } from "@cucumber/cucumber";
import { Sc04ValidateActivityRecommendationsSteps } from "../Steps/SC-04-Validate_Activity_Recommendations.steps";

const steps = new Sc04ValidateActivityRecommendationsSteps();

Then("validate that activity suitability is determined based on the weather conditions for each forecast day", () =>
    steps.VALIDATE_THAT_ACTIVITY_SUITABILITY_IS_DETERMINED_BASED_ON_THE_WEATHER_CONDITIONS_FOR_EACH_FORECAST_DAY()
);

Then("validate that every forecast day contains all supported activities", () =>
    steps.VALIDATE_THAT_EVERY_FORECAST_DAY_CONTAINS_ALL_SUPPORTED_ACTIVITIES()
);

Then("validate that every activity includes reasoning explaining its suitability", () =>
    steps.VALIDATE_THAT_EVERY_ACTIVITY_INCLUDES_REASONING_EXPLAINING_ITS_SUITABILITY()
);
