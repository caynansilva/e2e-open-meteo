// Native Cucumber bindings generated from: [SC-01] - Validate city search and resolution
import { Given, Then, When } from "@cucumber/cucumber";
import type { CucumberWorld } from "src/Support/CucumberWorld";
import { Sc01ValidateCitySearchAndResolutionSteps } from "../Steps/SC-01.1-Validate_Exact_City_Search.steps";

const steps = new Sc01ValidateCitySearchAndResolutionSteps();

Given("the user sends a request with a valid and unique city name for exact city resolution", function (this: CucumberWorld) {
  steps.THE_USER_SENDS_A_REQUEST_WITH_A_VALID_AND_UNIQUE_CITY_NAME_FOR_EXACT_CITY_RESOLUTION(this);
});

When("the API returns the exact city response", function (this: CucumberWorld) {
  steps.THE_API_RETURNS_THE_EXACT_CITY_RESPONSE(this);
});

Then("validate that the returned city name matches the city provided in the request", function (this: CucumberWorld) {
  steps.VALIDATE_THAT_THE_RETURNED_CITY_NAME_MATCHES_THE_CITY_PROVIDED_IN_THE_REQUEST(this);
});
