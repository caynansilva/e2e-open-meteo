// Native Cucumber bindings generated from: Activity Ranking API endpoint and response contract
import { Then, When } from "@cucumber/cucumber";
import type { CucumberWorld } from "../../Support/CucumberWorld";
import { Sc066ValidateUnsupportedHttpMethodSteps } from "../Steps/SC-06.6-Validate_Unsupported_HTTP_Method.steps";
import "./SC-06-API_Contract_Shared.spec";

const steps = new Sc066ValidateUnsupportedHttpMethodSteps();

When(
    "the client sends a POST request to the activities endpoint",
    async function (this: CucumberWorld) {
        await steps.THE_CLIENT_SENDS_A_POST_REQUEST_TO_THE_ACTIVITIES_ENDPOINT(this);
    }
);

Then(
    "validate that the response indicates that the HTTP method is not allowed",
    function (this: CucumberWorld) {
        steps.VALIDATE_THAT_THE_RESPONSE_INDICATES_THAT_THE_HTTP_METHOD_IS_NOT_ALLOWED(this);
    }
);
