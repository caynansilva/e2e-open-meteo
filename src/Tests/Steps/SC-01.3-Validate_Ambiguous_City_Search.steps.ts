import { BaseClass } from "src/BaseClass";
import type { CityActivity } from "src/Types";

export class Sc013ValidateAmbiguousCitySearchSteps extends BaseClass {
  public partialCityName = "";
  public searchResults!: CityActivity[];

  public THE_USER_SENDS_A_REQUEST_WITH_A_VALID_PARTIAL_CITY_NAME_FOR_AMBIGUOUS_MATCHES(): void {
    this.partialCityName = "San";
  }

  public async THE_API_RETURNS_THE_AMBIGUOUS_PARTIAL_CITY_RESPONSE(): Promise<void> {
    this.searchResults = await this.activityRankingClient.searchCities(
      this.partialCityName
    );
  }

  public VALIDATE_THAT_MULTIPLE_MATCHING_LOCATIONS_ARE_RETURNED(): void {
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
    this.assert(
      this.actMgr.assertMultiplePartialCityResults(this.searchResults),
      "Success! Multiple locations were returned for the partial city name \"" +
        this.partialCityName +
        "\"!",
      "Fail! Multiple locations were not returned for the partial city name \"" +
        this.partialCityName +
        "\"!"
    );
  }
}
