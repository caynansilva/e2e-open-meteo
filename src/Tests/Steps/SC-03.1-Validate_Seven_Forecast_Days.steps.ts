import { BaseClass } from "src/BaseClass";
import type { CityActivity } from "src/Types";

export class Sc031ValidateSevenForecastDaysSteps extends BaseClass {
  public requestedCity = "";
  public activityResponse!: CityActivity;

  public THE_USER_SENDS_A_REQUEST_FOR_A_VALID_CITY_FOR_THE_SEVEN_DAY_FORECAST(): void {
    this.requestedCity = "London";
  }

  public async THE_API_RETURNS_THE_SEVEN_DAY_FORECAST_RESPONSE(): Promise<void> {
    this.activityResponse = await this.activityRankingClient.getActivityRanking(
      this.requestedCity
    );
  }

  public VALIDATE_THAT_THE_RESPONSE_CONTAINS_EXACTLY_INT_FORECAST_DAYS(
    expectedDays: number
  ): void {
    this.assert(
      this.actMgr.assertForecastHasExactlyDays(
        this.activityResponse,
        expectedDays
      ),
      "Success! The response contains exactly " + expectedDays + " forecast days!",
      "Fail! The response does not contain exactly " + expectedDays + " forecast days!"
    );
  }
}
