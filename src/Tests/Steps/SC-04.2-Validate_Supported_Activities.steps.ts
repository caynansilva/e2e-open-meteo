import { BaseClass } from "src/BaseClass";
import type { CityActivity } from "src/Types";
import {
  CucumberWorld,
  WORLD_DATA_KEYS
} from "src/Support/CucumberWorld";

export class Sc042ValidateSupportedActivitiesSteps extends BaseClass {
  public THE_USER_REQUESTS_THE_FORECAST_ACTIVITY_RANKINGS_FOR_SUPPORTED_ACTIVITIES_VALIDATION(
    world: CucumberWorld
  ): void {
    world.setData(WORLD_DATA_KEYS.requestedCity, "London");
  }

  public async THE_API_RETURNS_THE_SUPPORTED_ACTIVITIES_RESPONSE(
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

  public VALIDATE_THAT_EVERY_FORECAST_DAY_CONTAINS_ALL_SUPPORTED_ACTIVITIES(
    world: CucumberWorld
  ): void {
    const activityResponse = this.getRequiredData<CityActivity>(
      world,
      WORLD_DATA_KEYS.activityResponse
    );
    const activityManager = this.createActivityManager();

    this.assert(
      activityManager.assertEveryForecastDayContainsAllSupportedActivities(
        activityResponse
      ),
      "Success! Every forecast day contains all supported activities!",
      "Fail! At least one forecast day does not contain all supported activities!"
    );
  }
}
