import { BaseClass } from "src/BaseClass";
import type { CityActivity } from "src/Types";

export class Sc01ValidateCitySearchAndResolutionSteps extends BaseClass {
  public requestedCity = "";
  public activityResponse!: CityActivity;

  public THE_USER_SENDS_A_REQUEST_WITH_A_VALID_AND_UNIQUE_CITY_NAME_FOR_EXACT_CITY_RESOLUTION(): void {
    this.requestedCity = this.mockData.getRandomCityName();
  }

  public async THE_API_RETURNS_THE_EXACT_CITY_RESPONSE(): Promise<void> {
    this.activityResponse = await this.activityRankingClient.getActivityRanking(
      this.requestedCity
    );
  }

  public VALIDATE_THAT_THE_RETURNED_CITY_NAME_MATCHES_THE_CITY_PROVIDED_IN_THE_REQUEST(): void {
    this.assert(
      this.actMgr.assertCityActivityExists(this.activityResponse),
      "Success! The field \"City Name\" exists in the contract!",
      "Fail! The field \"City Name\" DOES NOT exists in the contract!"
    );
    this.assert(
      this.actMgr.assertCityNameMatches(this.activityResponse, this.requestedCity),
      "Success! The field \"CityName\" matches the expected result \"" +
        this.requestedCity +
        "\"!",
      "Fail! The field \"CityName\" don't matches the expected result \"" +
        this.requestedCity +
        "\"!"
    );
  }
}
