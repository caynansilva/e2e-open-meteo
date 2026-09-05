import { BaseClass } from "src/BaseClass";
import { cityNames } from "src/fixtures/MockCityActivitiesFactory";
import type { CityActivity } from "src/Types";
import {
  CucumberWorld,
  WORLD_DATA_KEYS
} from "src/Support/CucumberWorld";

export class Sc013ValidateAmbiguousCitySearchSteps extends BaseClass {
  public THE_USER_SENDS_A_REQUEST_WITH_A_VALID_PARTIAL_CITY_NAME_FOR_AMBIGUOUS_MATCHES(
    world: CucumberWorld
  ): void {
    world.setData(WORLD_DATA_KEYS.partialCityName, "San");
  }

  public THE_API_RETURNS_THE_AMBIGUOUS_PARTIAL_CITY_RESPONSE(
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

  public VALIDATE_THAT_MULTIPLE_MATCHING_LOCATIONS_ARE_RETURNED(
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
    this.assert(
      activityManager.assertMultiplePartialCityResults(searchResults),
      "Success! Multiple locations were returned for the partial city name \"" +
        partialCityName +
        "\"!",
      "Fail! Multiple locations were not returned for the partial city name \"" +
        partialCityName +
        "\"!"
    );
  }
}
