// Native Cucumber bindings generated from: [SC-02] - Validate the API response contract
import { Given, Then, When } from "@cucumber/cucumber";
import { Sc021ValidateInvalidCityErrorSteps } from "../Steps/SC-02.1-Validate_Invalid_City_Error.steps";

const steps = new Sc021ValidateInvalidCityErrorSteps();

Given("the user sends a request with an invalid city name", () =>
    steps.THE_USER_SENDS_A_REQUEST_WITH_AN_INVALID_CITY_NAME()
);

When("the API returns the city not found error", () =>
    steps.THE_API_RETURNS_THE_CITY_NOT_FOUND_ERROR()
);

Then("validate that a clear error response indicates that the city could not be found", () =>
    steps.VALIDATE_THAT_A_CLEAR_ERROR_RESPONSE_INDICATES_THAT_THE_CITY_COULD_NOT_BE_FOUND()
);
