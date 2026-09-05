import { BaseClass } from "src/BaseClass";
import type { CityActivity } from "src/Types";

export class Sc022ValidateResponseRequiredFieldsSteps extends BaseClass {
  public requestedCity = "";
  public activityResponse!: CityActivity;

  public THE_USER_SENDS_A_REQUEST_WITH_A_VALID_AND_UNIQUE_CITY_NAME_FOR_RESPONSE_CONTRACT_VALIDATION(): void {
    this.requestedCity = "London";
  }

  public async THE_API_RETURNS_THE_CONTRACT_RESPONSE(): Promise<void> {
    this.activityResponse = await this.activityRankingClient.getActivityRanking(
      this.requestedCity
    );
  }

  public VALIDATE_THAT_ALL_FIELDS_DEFINED_BY_THE_API_CONTRACT_ARE_PRESENT_IN_THE_RESPONSE(): void {
    this.assert(
      this.actMgr.assertResponseContractFieldsExist(this.activityResponse),
      "Success! The response contains the required City Name, Current Date, and Forecast Days fields!",
      "Fail! The response does not contain all required City Name, Current Date, and Forecast Days fields!"
    );
  }
}
