import { Given, Then } from "@cucumber/cucumber";
import type { CucumberWorld } from "../../Support/CucumberWorld";
import { APIScenarariosSharedSteps } from "../Steps/APIScenarariosSharedSteps.steps";

const steps = new APIScenarariosSharedSteps();

Given(
    "the Activity Ranking API endpoint is available",
    function (this: CucumberWorld) {
        steps.THE_ACTIVITY_RANKING_API_ENDPOINT_IS_AVAILABLE(this);
    }
);

Given(
    "the Activity Ranking API is available",
    function (this: CucumberWorld) {
        steps.THE_ACTIVITY_RANKING_API_IS_AVAILABLE(this);
    }
);

Then(
    "validate that the response status is {int}",
    function (this: CucumberWorld, expectedStatus: number) {
        steps.VALIDATE_THAT_THE_RESPONSE_STATUS_IS_INT(this, expectedStatus);
    }
);

Then(
    "validate that the response contains a clear client error",
    function (this: CucumberWorld) {
        steps.VALIDATE_THAT_THE_RESPONSE_CONTAINS_A_CLEAR_CLIENT_ERROR(this);
    }
);
