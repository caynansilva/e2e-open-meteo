// Steps generated from: [SC-02] - Validate the API response contract
import { world as cucumberWorld } from "@cucumber/cucumber";
import { CucumberWorld } from "../../Support/CucumberWorld";

export class Sc02ValidateTheApiResponseContractSteps {
  private get world(): CucumberWorld {
    return cucumberWorld as CucumberWorld;
  }

  public THE_USER_SENDS_A_REQUEST_WITH_AN_INVALID_CITY_NAME(): void {
    throw new Error("TODO: Implement the user sends a request with an invalid city name");
  }

  public THE_API_RETURNS_THE_RESPONSE(): void {
    throw new Error("TODO: Implement the API returns the response");
  }

  public VALIDATE_THAT_A_CLEAR_ERROR_RESPONSE_INDICATES_THAT_THE_CITY_COULD_NOT_BE_FOUND(): void {
    throw new Error("TODO: Implement validate that a clear error response indicates that the city could not be found");
  }
}
