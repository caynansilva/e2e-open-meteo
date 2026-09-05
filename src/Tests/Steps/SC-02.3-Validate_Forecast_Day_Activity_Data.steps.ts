import { BaseClass } from "src/BaseClass";
import type { CityActivity } from "src/Types";
import {
  CucumberWorld,
  WORLD_DATA_KEYS
} from "src/Support/CucumberWorld";

export class Sc023ValidateForecastDayActivityDataSteps extends BaseClass {
  public THE_USER_REQUESTS_THE_FORECAST_ACTIVITY_RANKINGS_FOR_FORECAST_ACTIVITY_DATA(
    world: CucumberWorld
  ): void {
    world.setData(WORLD_DATA_KEYS.requestedCity, "London");
  }

  public THE_API_RETURNS_THE_FORECAST_ACTIVITY_DATA_RESPONSE(
    world: CucumberWorld
  ): void {
    const requestedCity = this.getRequiredData<string>(
      world,
      WORLD_DATA_KEYS.requestedCity
    );
    const activityResponse = this.mockData.returnWeatherSensitiveMockData(
      requestedCity
    );

    world.setData(WORLD_DATA_KEYS.activityResponse, activityResponse);
  }

  public VALIDATE_THAT_EACH_FORECAST_DAY_CONTAINS_THE_REQUIRED_ACTIVITY_DATA(
    world: CucumberWorld
  ): void {
    const activityResponse = this.getRequiredData<CityActivity>(
      world,
      WORLD_DATA_KEYS.activityResponse
    );
    const activityManager = this.createActivityManager();

    this.assert(
      activityManager.assertEveryForecastDayHasActivities(activityResponse),
      "Success! Every forecast day contains activity recommendations!",
      "Fail! At least one forecast day does not contain activity recommendations!"
    );
    this.assert(
      activityManager.assertActivityDataIsValid(activityResponse),
      "Success! Every forecast day contains complete activity data!",
      "Fail! At least one forecast day does not contain complete activity data!"
    );
  }
}
