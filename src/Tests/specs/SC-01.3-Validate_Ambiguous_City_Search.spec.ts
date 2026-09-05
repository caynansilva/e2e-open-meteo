// Native Cucumber bindings generated from: [SC-01] - Validate city search and resolution
import { Given, Then, When } from "@cucumber/cucumber";
import type { CucumberWorld } from "src/Support/CucumberWorld";
import { Sc013ValidateAmbiguousCitySearchSteps } from "../Steps/SC-01.3-Validate_Ambiguous_City_Search.steps";

const steps = new Sc013ValidateAmbiguousCitySearchSteps();

Given("the user sends a request with a valid partial city name for ambiguous matches", function (this: CucumberWorld) {
  steps.THE_USER_SENDS_A_REQUEST_WITH_A_VALID_PARTIAL_CITY_NAME_FOR_AMBIGUOUS_MATCHES(this);
});

When("the API returns the ambiguous partial city response", function (this: CucumberWorld) {
  steps.THE_API_RETURNS_THE_AMBIGUOUS_PARTIAL_CITY_RESPONSE(this);
});

Then("validate that multiple matching locations are returned", function (this: CucumberWorld) {
  steps.VALIDATE_THAT_MULTIPLE_MATCHING_LOCATIONS_ARE_RETURNED(this);
});
