import { Given, When } from "@cucumber/cucumber";
import { ActivityRankingSharedSteps } from "../Steps/ActivityRankingShared.steps";

const steps = new ActivityRankingSharedSteps(
);

Given("the user sends a request with a valid and unique city name", () =>
  steps.QUEUE_UNIQUE_CITY_RESPONSE()

);

Given("the user requests the forecast activity rankings for a valid city", () =>
  steps.QUEUE_FORECAST_ACTIVITY_RESPONSE()

);

When("the API returns the response", () =>
  steps.THE_API_RETURNS_THE_RESPONSE()

);
