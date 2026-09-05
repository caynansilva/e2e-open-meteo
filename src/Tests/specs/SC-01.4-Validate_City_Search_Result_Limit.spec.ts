// Native Cucumber bindings generated from: [SC-01] - Validate city search and resolution
import { Given, Then, When } from "@cucumber/cucumber";
import { Sc014ValidateCitySearchResultLimitSteps } from "../Steps/SC-01.4-Validate_City_Search_Result_Limit.steps";

const steps = new Sc014ValidateCitySearchResultLimitSteps();

Given("the user sends a request with a valid partial city name for a limited result set", () =>
    steps.THE_USER_SENDS_A_REQUEST_WITH_A_VALID_PARTIAL_CITY_NAME_FOR_A_LIMITED_RESULT_SET()
);

When("the API returns the limited partial city response", () =>
    steps.THE_API_RETURNS_THE_LIMITED_PARTIAL_CITY_RESPONSE()
);

Then("validate that matching locations are returned", () =>
    steps.VALIDATE_THAT_MATCHING_LOCATIONS_ARE_RETURNED()
);

Then("validate that the number of returned results is limited", () =>
    steps.VALIDATE_THAT_THE_NUMBER_OF_RETURNED_RESULTS_IS_LIMITED()
);
