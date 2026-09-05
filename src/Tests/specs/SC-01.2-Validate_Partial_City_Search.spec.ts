// Native Cucumber bindings generated from: [SC-01] - Validate city search and resolution
import { Given, Then, When } from "@cucumber/cucumber";
import type { CucumberWorld } from "src/Support/CucumberWorld";
import { Sc012ValidatePartialCitySearchSteps } from "../Steps/SC-01.2-Validate_Partial_City_Search.steps";

const steps = new Sc012ValidatePartialCitySearchSteps();

Given("the user sends a request with a valid partial city name for matching locations", function (this: CucumberWorld) {
  steps.THE_USER_SENDS_A_REQUEST_WITH_A_VALID_PARTIAL_CITY_NAME_FOR_MATCHING_LOCATIONS(this);
});

When("the API returns the matching partial city response", function (this: CucumberWorld) {
  steps.THE_API_RETURNS_THE_MATCHING_PARTIAL_CITY_RESPONSE(this);
});

Then("validate that the response contains results matching the provided partial city name", function (this: CucumberWorld) {
  steps.VALIDATE_THAT_THE_RESPONSE_CONTAINS_RESULTS_MATCHING_THE_PROVIDED_PARTIAL_CITY_NAME(this);
});
