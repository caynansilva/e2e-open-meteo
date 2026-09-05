import { BaseClass } from "src/BaseClass";
import type { CityActivity } from "src/Types";

export class Sc051ValidateActivitySuitabilityScoreSteps extends BaseClass {
  public requestedCity = "";
  public activityResponse!: CityActivity;

  public THE_USER_REQUESTS_THE_FORECAST_ACTIVITY_RANKINGS_FOR_RANKED_ACTIVITY_LIST_VALIDATION(): void {
    this.requestedCity = "London";
  }

  public async THE_API_RETURNS_THE_RANKED_ACTIVITY_LIST_RESPONSE(): Promise<void> {
    this.activityResponse = await this.activityRankingClient.getActivityRanking(
      this.requestedCity
    );
  }

  public VALIDATE_THAT_EACH_FORECAST_DAY_CONTAINS_A_RANKED_LIST_OF_ACTIVITIES(): void {
    this.assert(
      this.actMgr.assertEveryForecastDayHasActivities(this.activityResponse),
      "Success! Every forecast day contains a ranked activity list!",
      "Fail! At least one forecast day does not contain a ranked activity list!"
    );
  }

  public VALIDATE_THAT_EACH_ACTIVITY_HAS_A_SUITABILITY_SCORE_BETWEEN_INT_AND_INT(
    minimumSuitability: number,
    maximumSuitability: number
  ): void {
    this.assert(
      this.actMgr.assertActivitySuitabilityValuesWithinRange(
        this.activityResponse,
        minimumSuitability,
        maximumSuitability
      ),
      "Success! Every activity suitability score is between " +
        minimumSuitability +
        " and " +
        maximumSuitability +
        "!",
      "Fail! At least one activity suitability score is outside " +
        minimumSuitability +
        " and " +
        maximumSuitability +
        "!"
    );
  }
}
