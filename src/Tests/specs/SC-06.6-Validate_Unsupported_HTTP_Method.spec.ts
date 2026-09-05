// Native Cucumber bindings generated from: Activity Ranking API endpoint and response contract
import { Then, When } from "@cucumber/cucumber";
import { Sc066ValidateUnsupportedHttpMethodSteps } from "../Steps/SC-06.6-Validate_Unsupported_HTTP_Method.steps";
import "./SC-06-API_Contract_Shared.spec";

const steps = new Sc066ValidateUnsupportedHttpMethodSteps();

When("the client sends a POST request to the activities endpoint", () =>
    steps.THE_CLIENT_SENDS_A_POST_REQUEST_TO_THE_ACTIVITIES_ENDPOINT()
);

Then("validate that the response indicates that the HTTP method is not allowed", () =>
    steps.VALIDATE_THAT_THE_RESPONSE_INDICATES_THAT_THE_HTTP_METHOD_IS_NOT_ALLOWED()
);
