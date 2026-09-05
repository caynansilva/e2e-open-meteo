// Native Cucumber bindings generated from: Activity Ranking API endpoint and response contract
import { When } from "@cucumber/cucumber";
import { Sc063ValidateEmptyCityParameterSteps } from "../Steps/SC-06.3-Validate_Empty_City_Parameter.steps";
import "./SC-06-API_Contract_Shared.spec";

const steps = new Sc063ValidateEmptyCityParameterSteps();

When("the client sends a GET request with an empty city parameter", () =>
    steps.THE_CLIENT_SENDS_A_GET_REQUEST_WITH_AN_EMPTY_CITY_PARAMETER()
);
