import { BaseClass } from "src/BaseClass";
import type { CityNotFoundError } from "src/Types";

export class Sc021ValidateInvalidCityErrorSteps extends BaseClass {
  public invalidCityName = "";
  public errorResponse!: CityNotFoundError;

  public THE_USER_SENDS_A_REQUEST_WITH_AN_INVALID_CITY_NAME(): void {
    this.invalidCityName = "Atlantis";
  }

  public async THE_API_RETURNS_THE_CITY_NOT_FOUND_ERROR(): Promise<void> {
    try {
      await this.activityRankingClient.getActivityRanking(this.invalidCityName);
    } catch (error: unknown) {
      if (error instanceof Error && error.cause !== undefined) {
        this.errorResponse = error.cause as CityNotFoundError;
        return;
      }

      throw error;
    }
  }

  public VALIDATE_THAT_A_CLEAR_ERROR_RESPONSE_INDICATES_THAT_THE_CITY_COULD_NOT_BE_FOUND(): void {
    this.assert(
      this.actMgr.assertCityNotFoundError(
        this.errorResponse,
        this.invalidCityName
      ),
      "Success! The error response clearly states that \"" +
        this.invalidCityName +
        "\" could not be found!",
      "Fail! The error response does not clearly state that \"" +
        this.invalidCityName +
        "\" could not be found!"
    );
  }
}
