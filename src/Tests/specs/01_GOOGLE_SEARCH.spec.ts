import { Given, Then, When } from "@cucumber/cucumber";
import { STEP } from "../Steps/01_GOOGLE_SEARCH.steps";

const steps = new STEP();

Given("the user is on the Google home page", () => 
  steps.NAVIGATE_TO_GOOGLE()
);

When("the user opens Google", () => 
  steps.NAVIGATE_TO_GOOGLE()
);

When("the user searches for a random term", () => 
  steps.SEARCH_FOR_RANDOM_TERM()
);

Then("the Google home page is displayed", () => 
  steps.VERIFY_GOOGLE_HOME_PAGE_DISPLAYED()
);

Then("the Google home page elements are displayed", () => 
  steps.VERIFY_GOOGLE_HOME_PAGE_ELEMENTS_DISPLAYED()
);

Then("Google displays the search results", () => 
  steps.VERIFY_GOOGLE_SEARCH_RESULTS_DISPLAYED()
);
