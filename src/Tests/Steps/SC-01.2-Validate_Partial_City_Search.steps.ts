import { BaseClass } from "src/BaseClass";
import { cityNames } from "src/fixtures/MockCityActivitiesFactory";
import type { CityActivity } from "src/Types";

export class Sc012ValidatePartialCitySearchSteps extends BaseClass {
  public partialCityName: string;
  public searchResults: CityActivity[];

  constructor() {
    super();
    this.testName = "[SC-01.2] - Retrieve possible locations using a partial city name";
    this.startTestMessage();
  }

  public THE_USER_SENDS_A_REQUEST_WITH_A_VALID_PARTIAL_CITY_NAME(): void {
    this.partialCityName = "New";
  }

  public THE_API_RETURNS_THE_RESPONSE(): void {
    this.actMgr.setCityActivities(
      this.mockData.getNamedCityActivities(cityNames)
    );
    this.searchResults = this.actMgr.getActivitiesByPartialCityName(
      this.partialCityName
    );
  }

  public VALIDATE_THAT_THE_RESPONSE_CONTAINS_RESULTS_MATCHING_THE_PROVIDED_PARTIAL_CITY_NAME(): void {
    this.assert(
      this.actMgr.assertPartialCityResultsMatch(
        this.partialCityName,
        this.searchResults
      ),
      `Success! All returned locations match the partial city name "${this.partialCityName}"!`,
      `Fail! Not all returned locations match the partial city name "${this.partialCityName}"!`
    );
  }
}
