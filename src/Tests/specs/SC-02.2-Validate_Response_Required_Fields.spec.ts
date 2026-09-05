// Native Cucumber bindings generated from: [SC-02] - Validate the API response contract
import { Given, Then, When } from "@cucumber/cucumber";
import { Sc022ValidateResponseRequiredFieldsSteps } from "../Steps/SC-02.2-Validate_Response_Required_Fields.steps";

const steps = new Sc022ValidateResponseRequiredFieldsSteps();

Given("the user sends a request with a valid and unique city name for response contract validation", () =>
    steps.THE_USER_SENDS_A_REQUEST_WITH_A_VALID_AND_UNIQUE_CITY_NAME_FOR_RESPONSE_CONTRACT_VALIDATION()
);

When("the API returns the contract response", () =>
    steps.THE_API_RETURNS_THE_CONTRACT_RESPONSE()
);

Then("validate that all fields defined by the API contract are present in the response", () =>
    steps.VALIDATE_THAT_ALL_FIELDS_DEFINED_BY_THE_API_CONTRACT_ARE_PRESENT_IN_THE_RESPONSE()
);
