import { BaseClass } from "src/BaseClass";
import type { CityActivity } from "src/Types";
import {
  CucumberWorld,
  WORLD_DATA_KEYS
} from "src/Support/CucumberWorld";

export class Sc01ValidateCitySearchAndResolutionSteps extends BaseClass {
  public THE_USER_SENDS_A_REQUEST_WITH_A_VALID_AND_UNIQUE_CITY_NAME_FOR_EXACT_CITY_RESOLUTION(
    world: CucumberWorld
  ): void {
    const requestedCity = this.mockData.getRandomCityName();

    world.setData(WORLD_DATA_KEYS.requestedCity, requestedCity);
  }

  public THE_API_RETURNS_THE_EXACT_CITY_RESPONSE(
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

  public VALIDATE_THAT_THE_RETURNED_CITY_NAME_MATCHES_THE_CITY_PROVIDED_IN_THE_REQUEST(
    world: CucumberWorld
  ): void {
    const activityResponse = this.getRequiredData<CityActivity>(
      world,
      WORLD_DATA_KEYS.activityResponse
    );
    const requestedCity = this.getRequiredData<string>(
      world,
      WORLD_DATA_KEYS.requestedCity
    );
    const activityManager = this.createActivityManager();

    this.assert(
      activityManager.assertCityActivityExists(activityResponse),
      "Success! The field \"City Name\" exists in the contract!",
      "Fail! The field \"City Name\" DOES NOT exists in the contract!"
    );
    this.assert(
      activityManager.assertCityNameMatches(
        activityResponse,
        requestedCity
      ),
      "Success! The field \"CityName\" matches the expected result \"" +
        requestedCity +
        "\"!",
      "Fail! The field \"CityName\" don't matches the expected result \"" +
        requestedCity +
        "\"!"
    );
  }
}
