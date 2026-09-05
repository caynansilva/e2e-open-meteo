// Native Cucumber bindings generated from: [SC-02] - Validate the API response contract
import { Given, Then, When } from "@cucumber/cucumber";
import type { CucumberWorld } from "src/Support/CucumberWorld";
import { Sc021ValidateInvalidCityErrorSteps } from "../Steps/SC-02.1-Validate_Invalid_City_Error.steps";

const steps = new Sc021ValidateInvalidCityErrorSteps();

Given("the user sends a request with an invalid city name", function (this: CucumberWorld) {
  steps.THE_USER_SENDS_A_REQUEST_WITH_AN_INVALID_CITY_NAME(this);
});

When("the API returns the city not found error", async function (this: CucumberWorld) {
  await steps.THE_API_RETURNS_THE_CITY_NOT_FOUND_ERROR(this);
});

Then("validate that a clear error response indicates that the city could not be found", function (this: CucumberWorld) {
  steps.VALIDATE_THAT_A_CLEAR_ERROR_RESPONSE_INDICATES_THAT_THE_CITY_COULD_NOT_BE_FOUND(this);
});
