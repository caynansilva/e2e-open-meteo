import { BaseClass } from "src/BaseClass";
import type { CityActivity } from "src/Types";

export class Sc032ValidateForecastStartDateSteps extends BaseClass {
  public requestedCity = "";
  public activityResponse!: CityActivity;

  public THE_USER_SENDS_A_REQUEST_FOR_A_VALID_CITY_FOR_THE_FORECAST_START_DATE(): void {
    this.requestedCity = "London";
  }

  public async THE_API_RETURNS_THE_FORECAST_DATE_RESPONSE(): Promise<void> {
    this.activityResponse = await this.activityRankingClient.getActivityRanking(
      this.requestedCity
    );
  }

  public VALIDATE_THAT_THE_FORECAST_STARTS_FROM_THE_NEXT_DAY(): void {
    this.assert(
      this.actMgr.assertForecastStartsOnNextDay(this.activityResponse),
      "Success! The forecast starts from the next calendar day!",
      "Fail! The forecast does not start on the next calendar day!"
    );
  }

  public VALIDATE_THAT_THE_CURRENT_DATE_IS_NOT_INCLUDED_IN_THE_FORECAST(): void {
    this.assert(
      this.actMgr.assertForecastDoesNotIncludeCurrentDate(this.activityResponse),
      "Success! The current date is not included in the forecast!",
      "Fail! The current date is included in the forecast!"
    );
  }
}
