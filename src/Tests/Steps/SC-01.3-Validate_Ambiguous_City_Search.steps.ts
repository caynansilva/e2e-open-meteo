import { BaseClass } from "src/BaseClass";
import { cityNames } from "src/fixtures/MockCityActivitiesFactory";
import type { CityActivity } from "src/Types";

export class Sc013ValidateAmbiguousCitySearchSteps extends BaseClass {
  public partialCityName: string;
  public searchResults: CityActivity[];

  constructor() {
    super();
    this.testName = "[SC-01.3] - Return multiple location matches for an ambiguous partial city name";
    this.startTestMessage();
  }

  public THE_USER_SENDS_A_REQUEST_WITH_A_VALID_PARTIAL_CITY_NAME_THAT_MATCHES_MULTIPLE_LOCATIONS(): void {
    this.partialCityName = "San";
  }

  public THE_API_RETURNS_THE_RESPONSE(): void {
    this.actMgr.setCityActivities(
      this.mockData.getNamedCityActivities(cityNames)
    );
    this.searchResults = this.actMgr.getActivitiesByPartialCityName(
      this.partialCityName
    );
  }

  public VALIDATE_THAT_MULTIPLE_MATCHING_LOCATIONS_ARE_RETURNED(): void {
    this.assert(
      this.actMgr.assertPartialCityResultsMatch(
        this.partialCityName,
        this.searchResults
      ),
      `Success! All returned locations match the partial city name "${this.partialCityName}"!`,
      `Fail! Not all returned locations match the partial city name "${this.partialCityName}"!`
    );
    this.assert(
      this.actMgr.assertMultiplePartialCityResults(this.searchResults),
      `Success! Multiple locations were returned for the partial city name "${this.partialCityName}"!`,
      `Fail! Multiple locations were not returned for the partial city name "${this.partialCityName}"!`
    );
  }
}
