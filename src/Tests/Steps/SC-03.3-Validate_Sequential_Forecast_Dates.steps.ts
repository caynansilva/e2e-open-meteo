import { BaseClass } from "src/BaseClass";
import type { CityActivity } from "src/Types";

export class Sc033ValidateSequentialForecastDatesSteps extends BaseClass {
  public requestedCity = "";
  public activityResponse!: CityActivity;

  public THE_USER_SENDS_A_REQUEST_FOR_A_VALID_CITY_FOR_SEQUENTIAL_FORECAST_DATES(): void {
    this.requestedCity = "London";
  }

  public async THE_API_RETURNS_THE_SEQUENTIAL_FORECAST_RESPONSE(): Promise<void> {
    this.activityResponse = await this.activityRankingClient.getActivityRanking(
      this.requestedCity
    );
  }

  public VALIDATE_THAT_THE_FORECAST_DATES_ARE_SEQUENTIAL(): void {
    this.assert(
      this.actMgr.assertForecastDatesAreSequential(this.activityResponse),
      "Success! The forecast dates are sequential without missing days!",
      "Fail! The forecast dates are not sequential or contain missing days!"
    );
  }

  public VALIDATE_THAT_THERE_ARE_NO_MISSING_OR_DUPLICATED_FORECAST_DAYS(): void {
    this.assert(
      this.actMgr.assertForecastDatesAreUnique(this.activityResponse),
      "Success! The forecast does not contain duplicated dates!",
      "Fail! The forecast contains duplicated dates!"
    );
  }
}
