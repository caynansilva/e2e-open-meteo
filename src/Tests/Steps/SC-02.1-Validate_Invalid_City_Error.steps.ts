import { BaseClass } from "src/BaseClass";
import type { CityNotFoundError } from "src/Types";

export class Sc021ValidateInvalidCityErrorSteps extends BaseClass {
  public invalidCityName: string;
  public errorResponse: CityNotFoundError;

  constructor() {
    super();
    this.testName = "[SC-02.1] - Return an appropriate error when the city does not exist";
    this.startTestMessage();
  }

  public THE_USER_SENDS_A_REQUEST_WITH_AN_INVALID_CITY_NAME(): void {
    this.invalidCityName = "Atlantis";
  }

  public THE_API_RETURNS_THE_CITY_NOT_FOUND_ERROR(): void {
    this.errorResponse = this.mockData.returnCityNotFoundError(
      this.invalidCityName
    );
  }

  public VALIDATE_THAT_A_CLEAR_ERROR_RESPONSE_INDICATES_THAT_THE_CITY_COULD_NOT_BE_FOUND(): void {
    this.assert(
      this.actMgr.assertCityNotFoundError(
        this.errorResponse,
        this.invalidCityName
      ),
      `Success! The error response clearly states that "${this.invalidCityName}" could not be found!`,
      `Fail! The error response does not clearly state that "${this.invalidCityName}" could not be found!`
    );
  }
}
