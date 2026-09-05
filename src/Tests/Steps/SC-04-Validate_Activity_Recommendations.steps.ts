import assert from "node:assert/strict";
import { ActivityRankingSharedSteps } from "./ActivityRankingShared.steps";

export class Sc04ValidateActivityRecommendationsSteps {
  private readonly shared = new ActivityRankingSharedSteps();

  public VALIDATE_THAT_ACTIVITY_SUITABILITY_IS_DETERMINED_BASED_ON_THE_WEATHER_CONDITIONS_FOR_EACH_FORECAST_DAY(): void {
    const response = this.shared.getCityResponse();
    const expected = this.shared.getExpectedResponse();
    assert.ok(this.shared.getCityActivities(response).assertCityActivityMatchesExpected(response, expected), "Expected the controlled weather fixture to retain its declared rankings and reasons.");
  }

  public VALIDATE_THAT_EVERY_FORECAST_DAY_CONTAINS_ALL_SUPPORTED_ACTIVITIES(): void {
    const response = this.shared.getCityResponse();
    assert.ok(this.shared.getCityActivities(response).assertEveryForecastDayContainsAllSupportedActivities(response), "Expected every forecast day to contain all supported activities.");
  }

  public VALIDATE_THAT_EVERY_ACTIVITY_INCLUDES_REASONING_EXPLAINING_ITS_SUITABILITY(): void {
    const response = this.shared.getCityResponse();
    assert.ok(this.shared.getCityActivities(response).assertActivityReasoningIsValid(response), "Expected every activity to include non-empty reasoning.");
  }
}
