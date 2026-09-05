// Native Cucumber bindings generated from: [SC-01] - Validate city search and resolution
import { Given, Then, When } from "@cucumber/cucumber";
import { Sc01ValidateCitySearchAndResolutionSteps } from "../Steps/SC-01.2-Validate_Partial_City_Search.steps";

const steps = new Sc01ValidateCitySearchAndResolutionSteps();

Given("the user sends a request with a valid partial city name", () =>
    steps.THE_USER_SENDS_A_REQUEST_WITH_A_VALID_PARTIAL_CITY_NAME()
);

When("the API returns the response", () =>
    steps.THE_API_RETURNS_THE_RESPONSE()
);

Then("validate that the response contains results matching the provided partial city name", () =>
    steps.VALIDATE_THAT_THE_RESPONSE_CONTAINS_RESULTS_MATCHING_THE_PROVIDED_PARTIAL_CITY_NAME()
);
