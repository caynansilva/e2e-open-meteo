import { BaseClass } from "src/BaseClass";
import { cityNames } from "src/fixtures/MockCityActivitiesFactory";
import type { CityActivity } from "src/Types";
import {
  CucumberWorld,
  WORLD_DATA_KEYS
} from "src/Support/CucumberWorld";

export class Sc012ValidatePartialCitySearchSteps extends BaseClass {
  public THE_USER_SENDS_A_REQUEST_WITH_A_VALID_PARTIAL_CITY_NAME_FOR_MATCHING_LOCATIONS(
    world: CucumberWorld
  ): void {
    world.setData(WORLD_DATA_KEYS.partialCityName, "New");
  }

  public THE_API_RETURNS_THE_MATCHING_PARTIAL_CITY_RESPONSE(
    world: CucumberWorld
  ): void {
    const partialCityName = this.getRequiredData<string>(
      world,
      WORLD_DATA_KEYS.partialCityName
    );
    const activityManager = this.createActivityManager();

    activityManager.setCityActivities(
      this.mockData.getNamedCityActivities(cityNames)
    );
    const searchResults = activityManager.getActivitiesByPartialCityName(
      partialCityName
    );

    world.setData(WORLD_DATA_KEYS.searchResults, searchResults);
  }

  public VALIDATE_THAT_THE_RESPONSE_CONTAINS_RESULTS_MATCHING_THE_PROVIDED_PARTIAL_CITY_NAME(
    world: CucumberWorld
  ): void {
    const partialCityName = this.getRequiredData<string>(
      world,
      WORLD_DATA_KEYS.partialCityName
    );
    const searchResults = this.getRequiredData<CityActivity[]>(
      world,
      WORLD_DATA_KEYS.searchResults
    );
    const activityManager = this.createActivityManager();

    this.assert(
      activityManager.assertPartialCityResultsMatch(
        partialCityName,
        searchResults
      ),
      "Success! All returned locations match the partial city name \"" +
        partialCityName +
        "\"!",
      "Fail! Not all returned locations match the partial city name \"" +
        partialCityName +
        "\"!"
    );
  }
}
