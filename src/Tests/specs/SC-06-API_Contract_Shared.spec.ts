import { Given, Then } from "@cucumber/cucumber";
import { APIScenarariosSharedSteps } from "../Steps/APIScenarariosSharedSteps.steps";

const steps = new APIScenarariosSharedSteps();

Given("the Activity Ranking API endpoint is available", () =>
    steps.THE_ACTIVITY_RANKING_API_ENDPOINT_IS_AVAILABLE()
);

Given("the Activity Ranking API is available", () =>
    steps.THE_ACTIVITY_RANKING_API_IS_AVAILABLE()
);

Then("validate that the response status is {int}", (expectedStatus: number) =>
    steps.VALIDATE_THAT_THE_RESPONSE_STATUS_IS_INT(expectedStatus)
);

Then("validate that the response contains a clear client error", () =>
    steps.VALIDATE_THAT_THE_RESPONSE_CONTAINS_A_CLEAR_CLIENT_ERROR()
);
