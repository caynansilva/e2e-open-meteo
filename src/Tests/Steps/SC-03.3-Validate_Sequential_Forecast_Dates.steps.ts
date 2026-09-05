import { BaseClass } from "src/BaseClass";
import type { CityActivity } from "src/Types";
import {
  CucumberWorld,
  WORLD_DATA_KEYS
} from "src/Support/CucumberWorld";

export class Sc033ValidateSequentialForecastDatesSteps extends BaseClass {
  public THE_USER_SENDS_A_REQUEST_FOR_A_VALID_CITY_FOR_SEQUENTIAL_FORECAST_DATES(
    world: CucumberWorld
  ): void {
    world.setData(WORLD_DATA_KEYS.requestedCity, "London");
  }

  public THE_API_RETURNS_THE_SEQUENTIAL_FORECAST_RESPONSE(
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

  public VALIDATE_THAT_THE_FORECAST_DATES_ARE_SEQUENTIAL(
    world: CucumberWorld
  ): void {
    const activityResponse = this.getRequiredData<CityActivity>(
      world,
      WORLD_DATA_KEYS.activityResponse
    );
    const activityManager = this.createActivityManager();

    this.assert(
      activityManager.assertForecastDatesAreSequential(activityResponse),
      "Success! The forecast dates are sequential without missing days!",
      "Fail! The forecast dates are not sequential or contain missing days!"
    );
  }

  public VALIDATE_THAT_THERE_ARE_NO_MISSING_OR_DUPLICATED_FORECAST_DAYS(
    world: CucumberWorld
  ): void {
    const activityResponse = this.getRequiredData<CityActivity>(
      world,
      WORLD_DATA_KEYS.activityResponse
    );
    const activityManager = this.createActivityManager();

    this.assert(
      activityManager.assertForecastDatesAreUnique(activityResponse),
      "Success! The forecast does not contain duplicated dates!",
      "Fail! The forecast contains duplicated dates!"
    );
  }
}
