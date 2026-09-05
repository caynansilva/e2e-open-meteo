import { BaseClass } from "src/BaseClass";
import type { CityActivity } from "src/Types";
import {
  CucumberWorld,
  WORLD_DATA_KEYS
} from "src/Support/CucumberWorld";

export class Sc051ValidateActivitySuitabilityScoreSteps extends BaseClass {
  public THE_USER_REQUESTS_THE_FORECAST_ACTIVITY_RANKINGS_FOR_RANKED_ACTIVITY_LIST_VALIDATION(
    world: CucumberWorld
  ): void {
    world.setData(WORLD_DATA_KEYS.requestedCity, "London");
  }

  public async THE_API_RETURNS_THE_RANKED_ACTIVITY_LIST_RESPONSE(
    world: CucumberWorld
  ): Promise<void> {
    const requestedCity = this.getRequiredData<string>(
      world,
      WORLD_DATA_KEYS.requestedCity
    );
    const activityResponse =
      await this.activityRankingClient.getActivityRanking(requestedCity);

    world.setData(WORLD_DATA_KEYS.activityResponse, activityResponse);
  }

  public VALIDATE_THAT_EACH_FORECAST_DAY_CONTAINS_A_RANKED_LIST_OF_ACTIVITIES(
    world: CucumberWorld
  ): void {
    const activityResponse = this.getRequiredData<CityActivity>(
      world,
      WORLD_DATA_KEYS.activityResponse
    );
    const activityManager = this.createActivityManager();

    this.assert(
      activityManager.assertEveryForecastDayHasActivities(activityResponse),
      "Success! Every forecast day contains a ranked activity list!",
      "Fail! At least one forecast day does not contain a ranked activity list!"
    );
  }

  public VALIDATE_THAT_EACH_ACTIVITY_HAS_A_SUITABILITY_SCORE_BETWEEN_INT_AND_INT(
    world: CucumberWorld,
    minimumSuitability: number,
    maximumSuitability: number
  ): void {
    const activityResponse = this.getRequiredData<CityActivity>(
      world,
      WORLD_DATA_KEYS.activityResponse
    );
    const activityManager = this.createActivityManager();

    this.assert(
      activityManager.assertActivitySuitabilityValuesWithinRange(
        activityResponse,
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
