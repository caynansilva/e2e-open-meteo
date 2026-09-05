import { BaseClass } from "src/BaseClass";
import type { CityActivity } from "src/Types";
import {
  CucumberWorld,
  WORLD_DATA_KEYS
} from "src/Support/CucumberWorld";

export class Sc031ValidateSevenForecastDaysSteps extends BaseClass {
  public THE_USER_SENDS_A_REQUEST_FOR_A_VALID_CITY_FOR_THE_SEVEN_DAY_FORECAST(
    world: CucumberWorld
  ): void {
    world.setData(WORLD_DATA_KEYS.requestedCity, "London");
  }

  public async THE_API_RETURNS_THE_SEVEN_DAY_FORECAST_RESPONSE(
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

  public VALIDATE_THAT_THE_RESPONSE_CONTAINS_EXACTLY_INT_FORECAST_DAYS(
    world: CucumberWorld,
    expectedDays: number
  ): void {
    const activityResponse = this.getRequiredData<CityActivity>(
      world,
      WORLD_DATA_KEYS.activityResponse
    );
    const activityManager = this.createActivityManager();

    this.assert(
      activityManager.assertForecastHasExactlyDays(
        activityResponse,
        expectedDays
      ),
      "Success! The response contains exactly " +
        expectedDays +
        " forecast days!",
      "Fail! The response does not contain exactly " +
        expectedDays +
        " forecast days!"
    );
  }
}
