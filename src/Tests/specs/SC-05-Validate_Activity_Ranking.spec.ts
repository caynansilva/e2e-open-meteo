// Native Cucumber bindings generated from: [SC-05] - Validate activity ranking
import { Then } from "@cucumber/cucumber";
import { Sc05ValidateActivityRankingSteps } from "../Steps/SC-05-Validate_Activity_Ranking.steps";

const steps = new Sc05ValidateActivityRankingSteps();

Then("validate that each forecast day contains a ranked list of activities", () =>
    steps.VALIDATE_THAT_EACH_FORECAST_DAY_CONTAINS_A_RANKED_LIST_OF_ACTIVITIES()
);

Then("validate that each activity has a suitability score between {int} and {int}", (expectedValue: number, expectedValue2: number) => 
    steps.VALIDATE_THAT_EACH_ACTIVITY_HAS_A_SUITABILITY_SCORE_BETWEEN_INT_AND_INT(expectedValue, expectedValue2)
);

Then("validate that the activities for each forecast day are ordered from highest to lowest suitability", () =>
    steps.VALIDATE_THAT_THE_ACTIVITIES_FOR_EACH_FORECAST_DAY_ARE_ORDERED_FROM_HIGHEST_TO_LOWEST_SUITABILITY()
);

Then("validate that all activity suitability values are between {int} and {int}", (expectedValue: number, expectedValue2: number) => 
    steps.VALIDATE_THAT_ALL_ACTIVITY_SUITABILITY_VALUES_ARE_BETWEEN_INT_AND_INT(expectedValue, expectedValue2)
);
