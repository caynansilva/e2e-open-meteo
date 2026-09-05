import { BaseClass } from "src/BaseClass";
import type { CityActivity } from "src/Types";
import {
  CucumberWorld,
  WORLD_DATA_KEYS
} from "src/Support/CucumberWorld";

export class Sc041ValidateWeatherImpactOnActivitiesSteps extends BaseClass {
  public THE_USER_REQUESTS_THE_FORECAST_ACTIVITY_RANKINGS_FOR_WEATHER_IMPACT_VALIDATION(
    world: CucumberWorld
  ): void {
    world.setData(WORLD_DATA_KEYS.requestedCity, "London");
  }

  public THE_API_RETURNS_THE_WEATHER_SENSITIVE_RANKINGS_RESPONSE(
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

  public VALIDATE_THAT_ACTIVITY_SUITABILITY_IS_DETERMINED_BASED_ON_THE_WEATHER_CONDITIONS_FOR_EACH_FORECAST_DAY(
    world: CucumberWorld
  ): void {
    const activityResponse = this.getRequiredData<CityActivity>(
      world,
      WORLD_DATA_KEYS.activityResponse
    );
    const activityManager = this.createActivityManager();

    this.assert(
      activityManager.assertWeatherSensitiveActivitySuitability(
        activityResponse
      ),
      "Success! Weather-sensitive suitability scores match every forecast day!",
      "Fail! Weather-sensitive suitability scores do not match every forecast day!"
    );
  }
}
