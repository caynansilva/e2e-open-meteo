// Native Cucumber bindings generated from: [SC-05] - Validate activity ranking
import { Given, Then, When } from "@cucumber/cucumber";
import { Sc052ValidateActivityRankingOrderSteps } from "../Steps/SC-05.2-Validate_Activity_Ranking_Order.steps";

const steps = new Sc052ValidateActivityRankingOrderSteps();

Given("the user requests the forecast activity rankings for a valid city", () =>
    steps.THE_USER_REQUESTS_THE_FORECAST_ACTIVITY_RANKINGS_FOR_A_VALID_CITY()
);

When("the API returns the response", () =>
    steps.THE_API_RETURNS_THE_RESPONSE()
);

Then("validate that the activities for each forecast day are ordered from highest to lowest suitability", () =>
    steps.VALIDATE_THAT_THE_ACTIVITIES_FOR_EACH_FORECAST_DAY_ARE_ORDERED_FROM_HIGHEST_TO_LOWEST_SUITABILITY()
);
