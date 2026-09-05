// Native Cucumber bindings generated from: [SC-01] - Validate city search and resolution
import { Given, Then } from "@cucumber/cucumber";
import { Sc01ValidateCitySearchAndResolutionSteps } from "../Steps/SC-01-Validate_City_Search.steps";

const steps = new Sc01ValidateCitySearchAndResolutionSteps();


Given("the user sends a request with a valid partial city name", () =>
    steps.THE_USER_SENDS_A_REQUEST_WITH_A_VALID_PARTIAL_CITY_NAME()
);

Given("the user sends a request with a valid partial city name that matches multiple locations", () =>
    steps.THE_USER_SENDS_A_REQUEST_WITH_A_VALID_PARTIAL_CITY_NAME_THAT_MATCHES_MULTIPLE_LOCATIONS()
);

Then("validate that the returned city name matches the city provided in the request", () =>

    steps.VALIDATE_THAT_THE_RETURNED_CITY_NAME_MATCHES_THE_CITY_PROVIDED_IN_THE_REQUEST()
);

Then("validate that the response contains results matching the provided partial city name", () =>
    steps.VALIDATE_THAT_THE_RESPONSE_CONTAINS_RESULTS_MATCHING_THE_PROVIDED_PARTIAL_CITY_NAME()
);


Then("validate that multiple matching locations are returned", () =>
    steps.VALIDATE_THAT_MULTIPLE_MATCHING_LOCATIONS_ARE_RETURNED()
);

Then("validate that matching locations are returned", () =>
    steps.VALIDATE_THAT_MATCHING_LOCATIONS_ARE_RETURNED()
);

Then("validate that the number of returned results is limited", () =>
    steps.VALIDATE_THAT_THE_NUMBER_OF_RETURNED_RESULTS_IS_LIMITED()
);
