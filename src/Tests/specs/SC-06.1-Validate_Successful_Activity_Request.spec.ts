// Native Cucumber bindings generated from: Activity Ranking API endpoint and response contract
import { Then, When } from "@cucumber/cucumber";
import type { CucumberWorld } from "../../Support/CucumberWorld";
import { Sc061ValidateSuccessfulActivityRequestSteps } from "../Steps/SC-06.1-Validate_Successful_Activity_Request.steps";
import "./SC-06-API_Contract_Shared.spec";

const steps = new Sc061ValidateSuccessfulActivityRequestSteps();

When(
    "the client sends a GET request for activities using a valid city",
    async function (this: CucumberWorld) {
        await steps.THE_CLIENT_SENDS_A_GET_REQUEST_FOR_ACTIVITIES_USING_A_VALID_CITY(this);
    }
);

Then(
    "validate that the response content type is JSON",
    function (this: CucumberWorld) {
        steps.VALIDATE_THAT_THE_RESPONSE_CONTENT_TYPE_IS_JSON(this);
    }
);
