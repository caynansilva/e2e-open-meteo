import { BaseClass } from "src/BaseClass";
import type { CityActivity } from "src/Types";
import {
  CucumberWorld,
  WORLD_DATA_KEYS
} from "src/Support/CucumberWorld";

export class Sc022ValidateResponseRequiredFieldsSteps extends BaseClass {
  public THE_USER_SENDS_A_REQUEST_WITH_A_VALID_AND_UNIQUE_CITY_NAME_FOR_RESPONSE_CONTRACT_VALIDATION(
    world: CucumberWorld
  ): void {
    world.setData(WORLD_DATA_KEYS.requestedCity, "London");
  }

  public async THE_API_RETURNS_THE_CONTRACT_RESPONSE(
    world: CucumberWorld
  ): Promise<void> {
    const requestedCity = this.getRequiredData<string>(
      world,
      WORLD_DATA_KEYS.requestedCity
    );
    const activityResponse =
      await this.activityRankingClient.getActivityRanking(requestedCity);

    world.setData(WORLD_DATA_KEYS.activityResponse, activityResponse);
  }

  public VALIDATE_THAT_ALL_FIELDS_DEFINED_BY_THE_API_CONTRACT_ARE_PRESENT_IN_THE_RESPONSE(
    world: CucumberWorld
  ): void {
    const activityResponse = this.getRequiredData<CityActivity>(
      world,
      WORLD_DATA_KEYS.activityResponse
    );
    const activityManager = this.createActivityManager();

    this.assert(
      activityManager.assertResponseContractFieldsExist(activityResponse),
      "Success! The response contains the required City Name, Current Date, and Forecast Days fields!",
      "Fail! The response does not contain all required City Name, Current Date, and Forecast Days fields!"
    );
  }
}
