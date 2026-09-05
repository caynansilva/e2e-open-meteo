import { BaseClass } from "src/BaseClass";
import type { CityActivity } from "src/Types";
import {
  CucumberWorld,
  WORLD_DATA_KEYS
} from "src/Support/CucumberWorld";

export class Sc032ValidateForecastStartDateSteps extends BaseClass {
  public THE_USER_SENDS_A_REQUEST_FOR_A_VALID_CITY_FOR_THE_FORECAST_START_DATE(
    world: CucumberWorld
  ): void {
    world.setData(WORLD_DATA_KEYS.requestedCity, "London");
  }

  public THE_API_RETURNS_THE_FORECAST_DATE_RESPONSE(
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

  public VALIDATE_THAT_THE_FORECAST_STARTS_FROM_THE_NEXT_DAY(
    world: CucumberWorld
  ): void {
    const activityResponse = this.getRequiredData<CityActivity>(
      world,
      WORLD_DATA_KEYS.activityResponse
    );
    const activityManager = this.createActivityManager();

    this.assert(
      activityManager.assertForecastStartsOnNextDay(activityResponse),
      "Success! The forecast starts on the next calendar day!",
      "Fail! The forecast does not start on the next calendar day!"
    );
  }

  public VALIDATE_THAT_THE_CURRENT_DATE_IS_NOT_INCLUDED_IN_THE_FORECAST(
    world: CucumberWorld
  ): void {
    const activityResponse = this.getRequiredData<CityActivity>(
      world,
      WORLD_DATA_KEYS.activityResponse
    );
    const activityManager = this.createActivityManager();

    this.assert(
      activityManager.assertForecastDoesNotIncludeCurrentDate(
        activityResponse
      ),
      "Success! The current date is not included in the forecast!",
      "Fail! The current date is included in the forecast!"
    );
  }
}
