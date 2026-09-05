// Native Cucumber bindings generated from: [SC-02] - Validate the API response contract
import { Given, Then } from "@cucumber/cucumber";
import { Sc02ValidateTheApiResponseContractSteps } from "../Steps/SC-02-Validate_API_Response_Contract.steps";

const steps = new Sc02ValidateTheApiResponseContractSteps();

Given("the user sends a request with an invalid city name", () =>
    steps.THE_USER_SENDS_A_REQUEST_WITH_AN_INVALID_CITY_NAME()
);

Then("validate that a clear error response indicates that the city could not be found", () =>
    steps.VALIDATE_THAT_A_CLEAR_ERROR_RESPONSE_INDICATES_THAT_THE_CITY_COULD_NOT_BE_FOUND()
);

Then("validate that all fields defined by the API contract are present in the response", () =>
    steps.VALIDATE_THAT_ALL_FIELDS_DEFINED_BY_THE_API_CONTRACT_ARE_PRESENT_IN_THE_RESPONSE()
);

Then("validate that each forecast day contains the required activity data", () =>
    steps.VALIDATE_THAT_EACH_FORECAST_DAY_CONTAINS_THE_REQUIRED_ACTIVITY_DATA()
);
