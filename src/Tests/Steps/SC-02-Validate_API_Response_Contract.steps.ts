import assert from "node:assert/strict";
import { ActivityRankingSharedSteps } from "./ActivityRankingShared.steps";

export class Sc02ValidateTheApiResponseContractSteps {
  private readonly shared = new ActivityRankingSharedSteps();

  public THE_USER_SENDS_A_REQUEST_WITH_AN_INVALID_CITY_NAME(): void {
    this.shared.QUEUE_CITY_NOT_FOUND_RESPONSE("NotARealCity");
  }

  public VALIDATE_THAT_A_CLEAR_ERROR_RESPONSE_INDICATES_THAT_THE_CITY_COULD_NOT_BE_FOUND(): void {
    const error = this.shared.getCityNotFoundError();
    assert.match(error.error, /could not be found/i, "Expected a clear city-not-found error.");
  }

  public VALIDATE_THAT_ALL_FIELDS_DEFINED_BY_THE_API_CONTRACT_ARE_PRESENT_IN_THE_RESPONSE(): void {
    const response = this.shared.getCityResponse();
    const activities = this.shared.getCityActivities(response);
    assert.ok(activities.assertCityActivityExists(response), "Expected a resolved city response.");
    assert.ok(activities.assertCurrentDateExists(response), "Expected the response to include a valid current date.");
    assert.ok(activities.assertForecastDatesAreValid(response), "Expected every forecast day to include a valid date.");
  }

  public VALIDATE_THAT_EACH_FORECAST_DAY_CONTAINS_THE_REQUIRED_ACTIVITY_DATA(): void {
    const response = this.shared.getCityResponse();
    assert.ok(this.shared.getCityActivities(response).assertActivityDataIsValid(response), "Expected each forecast day to contain complete activity data.");
  }
}
