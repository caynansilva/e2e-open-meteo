import { BaseClass } from "src/BaseClass";
import type { CityNotFoundError } from "src/Types";
import {
  CucumberWorld,
  WORLD_DATA_KEYS
} from "src/Support/CucumberWorld";

export class Sc021ValidateInvalidCityErrorSteps extends BaseClass {
  public THE_USER_SENDS_A_REQUEST_WITH_AN_INVALID_CITY_NAME(
    world: CucumberWorld
  ): void {
    world.setData(WORLD_DATA_KEYS.invalidCityName, "Atlantis");
  }

  public THE_API_RETURNS_THE_CITY_NOT_FOUND_ERROR(
    world: CucumberWorld
  ): void {
    const invalidCityName = this.getRequiredData<string>(
      world,
      WORLD_DATA_KEYS.invalidCityName
    );
    const errorResponse = this.mockData.returnCityNotFoundError(
      invalidCityName
    );

    world.setData(WORLD_DATA_KEYS.errorResponse, errorResponse);
  }

  public VALIDATE_THAT_A_CLEAR_ERROR_RESPONSE_INDICATES_THAT_THE_CITY_COULD_NOT_BE_FOUND(
    world: CucumberWorld
  ): void {
    const errorResponse = this.getRequiredData<CityNotFoundError>(
      world,
      WORLD_DATA_KEYS.errorResponse
    );
    const invalidCityName = this.getRequiredData<string>(
      world,
      WORLD_DATA_KEYS.invalidCityName
    );
    const activityManager = this.createActivityManager();

    this.assert(
      activityManager.assertCityNotFoundError(
        errorResponse,
        invalidCityName
      ),
      "Success! The error response clearly states that \"" +
        invalidCityName +
        "\" could not be found!",
      "Fail! The error response does not clearly state that \"" +
        invalidCityName +
        "\" could not be found!"
    );
  }
}
