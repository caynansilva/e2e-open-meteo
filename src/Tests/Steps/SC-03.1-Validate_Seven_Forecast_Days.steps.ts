// Steps generated from: [SC-03] - Validate forecast days
import { world as cucumberWorld } from "@cucumber/cucumber";
import { CucumberWorld } from "../../Support/CucumberWorld";

export class Sc03ValidateForecastDaysSteps {
  private get world(): CucumberWorld {
    return cucumberWorld as CucumberWorld;
  }

  public THE_USER_SENDS_A_REQUEST_FOR_A_VALID_CITY(): void {
    throw new Error("TODO: Implement the user sends a request for a valid city");
  }

  public THE_API_RETURNS_THE_RESPONSE(): void {
    throw new Error("TODO: Implement the API returns the response");
  }

  public VALIDATE_THAT_THE_RESPONSE_CONTAINS_EXACTLY_INT_FORECAST_DAYS(expectedDays: number): void {
    throw new Error("TODO: Implement validate that the response contains exactly 7 forecast days");
  }
}
