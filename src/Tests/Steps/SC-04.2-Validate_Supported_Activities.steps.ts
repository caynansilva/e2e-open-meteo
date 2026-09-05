import { BaseClass } from "src/BaseClass";
import type { CityActivity } from "src/Types";

export class Sc042ValidateSupportedActivitiesSteps extends BaseClass {
  public requestedCity = "";
  public activityResponse!: CityActivity;

  public THE_USER_REQUESTS_THE_FORECAST_ACTIVITY_RANKINGS_FOR_SUPPORTED_ACTIVITIES_VALIDATION(): void {
    this.requestedCity = "London";
  }

  public async THE_API_RETURNS_THE_SUPPORTED_ACTIVITIES_RESPONSE(): Promise<void> {
    this.activityResponse = await this.activityRankingClient.getActivityRanking(
      this.requestedCity
    );
  }

  public VALIDATE_THAT_EVERY_FORECAST_DAY_CONTAINS_ALL_SUPPORTED_ACTIVITIES(): void {
    this.assert(
      this.actMgr.assertEveryForecastDayContainsAllSupportedActivities(
        this.activityResponse
      ),
      "Success! Every forecast day contains all supported activities!",
      "Fail! At least one forecast day does not contain all supported activities!"
    );
  }
}
