import assert from "node:assert/strict";
import { ActivityRankingSharedSteps } from "./ActivityRankingShared.steps";

export class Sc05ValidateActivityRankingSteps {
  private readonly shared = new ActivityRankingSharedSteps();

  public VALIDATE_THAT_EACH_FORECAST_DAY_CONTAINS_A_RANKED_LIST_OF_ACTIVITIES(): void {
    const response = this.shared.getCityResponse();
    assert.ok(this.shared.getCityActivities(response).assertEveryForecastDayHasActivities(response), "Expected every forecast day to contain activities.");
  }

  public VALIDATE_THAT_EACH_ACTIVITY_HAS_A_SUITABILITY_SCORE_BETWEEN_INT_AND_INT(minimum: number, maximum: number): void {
    this.assertSupportedSuitabilityRange(minimum, maximum);
  }

  public VALIDATE_THAT_THE_ACTIVITIES_FOR_EACH_FORECAST_DAY_ARE_ORDERED_FROM_HIGHEST_TO_LOWEST_SUITABILITY(): void {
    const response = this.shared.getCityResponse();
    assert.ok(this.shared.getCityActivities(response).assertActivitiesAreRankedBySuitability(response), "Expected activities to be ordered from highest to lowest suitability.");
  }

  public VALIDATE_THAT_ALL_ACTIVITY_SUITABILITY_VALUES_ARE_BETWEEN_INT_AND_INT(minimum: number, maximum: number): void {
    this.assertSupportedSuitabilityRange(minimum, maximum);
  }

  private assertSupportedSuitabilityRange(minimum: number, maximum: number): void {
    const response = this.shared.getCityResponse();
    assert.deepEqual([minimum, maximum], [0, 100], "The Activity Ranking contract accepts suitability values from 0 through 100.");
    assert.ok(this.shared.getCityActivities(response).assertActivitySuitabilityValuesAreValid(response), "Expected every activity suitability value to be from 0 through 100.");
  }
}
