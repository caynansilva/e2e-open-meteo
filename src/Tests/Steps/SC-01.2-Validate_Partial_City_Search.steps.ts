import { BaseClass } from "src/BaseClass";
import type { CityActivity } from "src/Types";

export class Sc012ValidatePartialCitySearchSteps extends BaseClass {
  public partialCityName = "";
  public searchResults!: CityActivity[];

  public THE_USER_SENDS_A_REQUEST_WITH_A_VALID_PARTIAL_CITY_NAME_FOR_MATCHING_LOCATIONS(): void {
    this.partialCityName = "New";
  }

  public async THE_API_RETURNS_THE_MATCHING_PARTIAL_CITY_RESPONSE(): Promise<void> {
    this.searchResults = await this.activityRankingClient.searchCities(
      this.partialCityName
    );
  }

  public VALIDATE_THAT_THE_RESPONSE_CONTAINS_RESULTS_MATCHING_THE_PROVIDED_PARTIAL_CITY_NAME(): void {
    this.assert(
      this.actMgr.assertPartialCityResultsMatch(
        this.partialCityName,
        this.searchResults
      ),
      "Success! All returned locations match the partial city name \"" +
        this.partialCityName +
        "\"!",
      "Fail! Not all returned locations match the partial city name \"" +
        this.partialCityName +
        "\"!"
    );
  }
}
