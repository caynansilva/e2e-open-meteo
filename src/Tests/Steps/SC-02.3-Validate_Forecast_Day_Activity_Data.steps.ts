import { BaseClass } from "src/BaseClass";
import type { CityActivity } from "src/Types";

export class Sc023ValidateForecastDayActivityDataSteps extends BaseClass {
  public requestedCity = "";
  public activityResponse!: CityActivity;

  public THE_USER_REQUESTS_THE_FORECAST_ACTIVITY_RANKINGS_FOR_FORECAST_ACTIVITY_DATA(): void {
    this.requestedCity = "London";
  }

  public async THE_API_RETURNS_THE_FORECAST_ACTIVITY_DATA_RESPONSE(): Promise<void> {
    this.activityResponse = await this.activityRankingClient.getActivityRanking(
      this.requestedCity
    );
  }

  public VALIDATE_THAT_EACH_FORECAST_DAY_CONTAINS_THE_REQUIRED_ACTIVITY_DATA(): void {
    this.assert(
      this.actMgr.assertEveryForecastDayHasActivities(this.activityResponse),
      "Success! Every forecast day contains activity recommendations!",
      "Fail! At least one forecast day does not contain activity recommendations!"
    );
    this.assert(
      this.actMgr.assertActivityDataIsValid(this.activityResponse),
      "Success! Every forecast day contains complete activity data!",
      "Fail! At least one forecast day does not contain complete activity data!"
    );
  }
}
