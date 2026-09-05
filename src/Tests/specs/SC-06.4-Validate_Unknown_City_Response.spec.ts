// Native Cucumber bindings generated from: Activity Ranking API endpoint and response contract
import { Then, When } from "@cucumber/cucumber";
import { Sc064ValidateUnknownCityResponseSteps } from "../Steps/SC-06.4-Validate_Unknown_City_Response.steps";
import "./SC-06-API_Contract_Shared.spec";

const steps = new Sc064ValidateUnknownCityResponseSteps();

When("the client sends a GET request for an unknown city", () =>
    steps.THE_CLIENT_SENDS_A_GET_REQUEST_FOR_AN_UNKNOWN_CITY()
);

Then("validate that the response indicates that the city was not found", () =>
    steps.VALIDATE_THAT_THE_RESPONSE_INDICATES_THAT_THE_CITY_WAS_NOT_FOUND()
);
