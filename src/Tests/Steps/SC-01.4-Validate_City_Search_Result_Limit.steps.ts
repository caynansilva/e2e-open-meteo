import { BaseClass } from "src/BaseClass";
import { cityNames } from "src/fixtures/MockCityActivitiesFactory";
import type { CityActivity } from "src/Types";

export class Sc014ValidateCitySearchResultLimitSteps extends BaseClass {
  public partialCityName: string;
  public maximumResults: number;
  public searchResults: CityActivity[];

  constructor() {
    super();
    this.testName = "[SC-01.4] - Limit the number of results returned by a partial city search";
    this.startTestMessage();
  }

  public THE_USER_SENDS_A_REQUEST_WITH_A_VALID_PARTIAL_CITY_NAME(): void {
    this.partialCityName = "San";
    this.maximumResults = 2;
  }

  public THE_API_RETURNS_THE_RESPONSE(): void {
    this.actMgr.setCityActivities(
      this.mockData.getNamedCityActivities(cityNames)
    );
    this.searchResults = this.actMgr.getActivitiesByPartialCityName(
      this.partialCityName,
      this.maximumResults
    );
  }

  public VALIDATE_THAT_MATCHING_LOCATIONS_ARE_RETURNED(): void {
    this.assert(
      this.actMgr.assertPartialCityResultsMatch(
        this.partialCityName,
        this.searchResults
      ),
      `Success! All returned locations match the partial city name "${this.partialCityName}"!`,
      `Fail! Not all returned locations match the partial city name "${this.partialCityName}"!`
    );
  }

  public VALIDATE_THAT_THE_NUMBER_OF_RETURNED_RESULTS_IS_LIMITED(): void {
    this.assert(
      this.actMgr.assertPartialCityResultsAreLimited(
        this.searchResults,
        this.maximumResults
      ),
      `Success! The number of returned locations does not exceed the limit of ${this.maximumResults}!`,
      `Fail! The number of returned locations exceeds the limit of ${this.maximumResults}!`
    );
    this.assert(
      this.actMgr.assertPartialCityResultsReachLimit(
        this.searchResults,
        this.maximumResults
      ),
      `Success! The response returns exactly ${this.maximumResults} locations when more matches are available!`,
      `Fail! The response does not return exactly ${this.maximumResults} locations when more matches are available!`
    );
  }
}
