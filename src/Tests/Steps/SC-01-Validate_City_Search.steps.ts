import assert from "node:assert/strict";
import { ActivityRankingSharedSteps } from "./ActivityRankingShared.steps";

const MAXIMUM_CITY_RESULTS = 10;

export class Sc01ValidateCitySearchAndResolutionSteps {
  private readonly shared = new ActivityRankingSharedSteps();

  public VALIDATE_THAT_THE_RETURNED_CITY_NAME_MATCHES_THE_CITY_PROVIDED_IN_THE_REQUEST(): void {
    const response = this.shared.getCityResponse();
    assert.ok(this.shared.getCityActivities(response).assertCityNameMatches(response, this.shared.getRequestedCity()), "Expected the returned city name to match the requested city.");
  }

  public THE_USER_SENDS_A_REQUEST_WITH_A_VALID_PARTIAL_CITY_NAME(): void {
    this.shared.QUEUE_PARTIAL_CITY_RESULTS("Lon", ["London", "Long Beach"]);
  }

  public VALIDATE_THAT_THE_RESPONSE_CONTAINS_RESULTS_MATCHING_THE_PROVIDED_PARTIAL_CITY_NAME(): void {
    const results = this.shared.getCityResults();
    assert.ok(this.shared.getCityActivities(results).assertPartialCityResultsMatch(this.shared.getRequestedCity(), results), "Expected every city result to match the requested partial city name.");
  }

  public THE_USER_SENDS_A_REQUEST_WITH_A_VALID_PARTIAL_CITY_NAME_THAT_MATCHES_MULTIPLE_LOCATIONS(): void {
    this.shared.QUEUE_PARTIAL_CITY_RESULTS("San", ["San Antonio", "San Diego", "San Jose"]);
  }

  public VALIDATE_THAT_MULTIPLE_MATCHING_LOCATIONS_ARE_RETURNED(): void {
    assert.ok(this.shared.getCityResults().length > 1, "Expected more than one matching city.");
  }

  public VALIDATE_THAT_MATCHING_LOCATIONS_ARE_RETURNED(): void {
    const results = this.shared.getCityResults();
    assert.ok(this.shared.getCityActivities(results).assertPartialCityResultsMatch(this.shared.getRequestedCity(), results), "Expected one or more matching cities.");
  }

  public VALIDATE_THAT_THE_NUMBER_OF_RETURNED_RESULTS_IS_LIMITED(): void {
    const results = this.shared.getCityResults();
    assert.ok(this.shared.getCityActivities(results).assertPartialCityResultsAreLimited(results, MAXIMUM_CITY_RESULTS), "Expected partial city results to be limited to ten.");
  }
}
