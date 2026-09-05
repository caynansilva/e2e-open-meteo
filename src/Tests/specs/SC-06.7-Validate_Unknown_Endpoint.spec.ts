// Native Cucumber bindings generated from: Activity Ranking API endpoint and response contract
import { Then, When } from "@cucumber/cucumber";
import { Sc067ValidateUnknownEndpointSteps } from "../Steps/SC-06.7-Validate_Unknown_Endpoint.steps";
import "./SC-06-API_Contract_Shared.spec";

const steps = new Sc067ValidateUnknownEndpointSteps();

When("the client sends a GET request to an unsupported endpoint", () =>
    steps.THE_CLIENT_SENDS_A_GET_REQUEST_TO_AN_UNSUPPORTED_ENDPOINT()
);

Then("validate that the response indicates that the endpoint was not found", () =>
    steps.VALIDATE_THAT_THE_RESPONSE_INDICATES_THAT_THE_ENDPOINT_WAS_NOT_FOUND()
);
