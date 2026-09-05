import { BaseClass } from "src/BaseClass";
import { cityNames } from "src/fixtures/MockCityActivitiesFactory";
import type { CityActivity } from "src/Types";
import {
  CucumberWorld,
  WORLD_DATA_KEYS
} from "src/Support/CucumberWorld";

export class Sc014ValidateCitySearchResultLimitSteps extends BaseClass {
  public THE_USER_SENDS_A_REQUEST_WITH_A_VALID_PARTIAL_CITY_NAME_FOR_A_LIMITED_RESULT_SET(
    world: CucumberWorld
  ): void {
    world.setData(WORLD_DATA_KEYS.partialCityName, "San");
    world.setData(WORLD_DATA_KEYS.maximumResults, 2);
  }

  public THE_API_RETURNS_THE_LIMITED_PARTIAL_CITY_RESPONSE(
    world: CucumberWorld
  ): void {
    const partialCityName = this.getRequiredData<string>(
      world,
      WORLD_DATA_KEYS.partialCityName
    );
    const maximumResults = this.getRequiredData<number>(
      world,
      WORLD_DATA_KEYS.maximumResults
    );
    const activityManager = this.createActivityManager();

    activityManager.setCityActivities(
      this.mockData.getNamedCityActivities(cityNames)
    );
    const searchResults = activityManager.getActivitiesByPartialCityName(
      partialCityName,
      maximumResults
    );

    world.setData(WORLD_DATA_KEYS.searchResults, searchResults);
  }

  public VALIDATE_THAT_MATCHING_LOCATIONS_ARE_RETURNED(
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

  public VALIDATE_THAT_THE_NUMBER_OF_RETURNED_RESULTS_IS_LIMITED(
    world: CucumberWorld
  ): void {
    const searchResults = this.getRequiredData<CityActivity[]>(
      world,
      WORLD_DATA_KEYS.searchResults
    );
    const maximumResults = this.getRequiredData<number>(
      world,
      WORLD_DATA_KEYS.maximumResults
    );
    const activityManager = this.createActivityManager();

    this.assert(
      activityManager.assertPartialCityResultsAreLimited(
        searchResults,
        maximumResults
      ),
      "Success! The number of returned locations does not exceed the limit of " +
        maximumResults +
        "!",
      "Fail! The number of returned locations exceeds the limit of " +
        maximumResults +
        "!"
    );
    this.assert(
      activityManager.assertPartialCityResultsReachLimit(
        searchResults,
        maximumResults
      ),
      "Success! The response returns exactly " +
        maximumResults +
        " locations when more matches are available!",
      "Fail! The response does not return exactly " +
        maximumResults +
        " locations when more matches are available!"
    );
  }
}
