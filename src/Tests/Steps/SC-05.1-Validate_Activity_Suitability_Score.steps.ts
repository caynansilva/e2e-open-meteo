// Steps generated from: [SC-05] - Validate activity ranking
import { world as cucumberWorld } from "@cucumber/cucumber";
import { CucumberWorld } from "../../Support/CucumberWorld";

export class Sc05ValidateActivityRankingSteps {
  private get world(): CucumberWorld {
    return cucumberWorld as CucumberWorld;
  }

  public THE_USER_REQUESTS_THE_FORECAST_ACTIVITY_RANKINGS_FOR_A_VALID_CITY(): void {
    throw new Error("TODO: Implement the user requests the forecast activity rankings for a valid city");
  }

  public THE_API_RETURNS_THE_RESPONSE(): void {
    throw new Error("TODO: Implement the API returns the response");
  }

  public VALIDATE_THAT_EACH_FORECAST_DAY_CONTAINS_A_RANKED_LIST_OF_ACTIVITIES(): void {
    throw new Error("TODO: Implement validate that each forecast day contains a ranked list of activities");
  }

  public VALIDATE_THAT_EACH_ACTIVITY_HAS_A_SUITABILITY_SCORE_BETWEEN_INT_AND_INT(expectedValue: number, expectedValue2: number): void {
    throw new Error("TODO: Implement validate that each activity has a suitability score between 0 and 100");
  }
}
