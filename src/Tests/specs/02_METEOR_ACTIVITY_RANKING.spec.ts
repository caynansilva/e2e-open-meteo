import { DataTable, Given, Then, When } from "@cucumber/cucumber";
import { ActivityRankingSteps } from "../Steps/02_METEOR_ACTIVITY_RANKING.steps";

const steps = new ActivityRankingSteps();

Given("the Activity Ranking API is available", () => steps.INITIALIZE_API());

When(
  "I request activity rankings for {string}",
  (city: string) => steps.REQUEST_RANKINGS(city)
);

Then("the response status should be {int}", (status: number) => steps.VERIFY_RESPONSE_STATUS(status));

Then("the response should contain rankings for {int} days", (days: number) => steps.VERIFY_RANKING_DAYS(days));

Then("every day should rank:", (dataTable: DataTable) => steps.VERIFY_EVERY_DAY_RANKS(dataTable));

Then("the response should list one or more city matches", () => steps.VERIFY_CITY_MATCHES());

Then("the response should identify that the city was not found", () => steps.VERIFY_CITY_NOT_FOUND());
