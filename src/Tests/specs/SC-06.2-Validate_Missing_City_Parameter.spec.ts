// Native Cucumber bindings generated from: Activity Ranking API endpoint and response contract
import { When } from "@cucumber/cucumber";
import { Sc062ValidateMissingCityParameterSteps } from "../Steps/SC-06.2-Validate_Missing_City_Parameter.steps";
import "./SC-06-API_Contract_Shared.spec";

const steps = new Sc062ValidateMissingCityParameterSteps();

When("the client sends a GET request to the activities endpoint without the city parameter", () =>
    steps.THE_CLIENT_SENDS_A_GET_REQUEST_TO_THE_ACTIVITIES_ENDPOINT_WITHOUT_THE_CITY_PARAMETER()
);
