import { BaseClass } from "src/BaseClass";
import type { CityActivity } from "src/Types";
import {
  CucumberWorld,
  WORLD_DATA_KEYS
} from "src/Support/CucumberWorld";

export class Sc053ValidateSuitabilityValueRangeSteps extends BaseClass {
  public THE_USER_REQUESTS_THE_FORECAST_ACTIVITY_RANKINGS_FOR_SUITABILITY_RANGE_VALIDATION(
    world: CucumberWorld
  ): void {
    world.setData(WORLD_DATA_KEYS.requestedCity, "London");
  }

  public THE_API_RETURNS_THE_SUITABILITY_RANGE_RESPONSE(
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

  public VALIDATE_THAT_ALL_ACTIVITY_SUITABILITY_VALUES_ARE_BETWEEN_INT_AND_INT(
    world: CucumberWorld,
    minimumSuitability: number,
    maximumSuitability: number
  ): void {
    const activityResponse = this.getRequiredData<CityActivity>(
      world,
      WORLD_DATA_KEYS.activityResponse
    );
    const activityManager = this.createActivityManager();

    this.assert(
      activityManager.assertActivitySuitabilityValuesWithinRange(
        activityResponse,
        minimumSuitability,
        maximumSuitability
      ),
      "Success! All activity suitability values are between " +
        minimumSuitability +
        " and " +
        maximumSuitability +
        "!",
      "Fail! At least one activity suitability value is outside " +
        minimumSuitability +
        " and " +
        maximumSuitability +
        "!"
    );
  }
}
