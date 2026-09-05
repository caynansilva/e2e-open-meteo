import { BaseClass } from "src/BaseClass";
import type { CityActivity } from "src/Types";

export class Sc053ValidateSuitabilityValueRangeSteps extends BaseClass {
  public requestedCity = "";
  public activityResponse!: CityActivity;

  public THE_USER_REQUESTS_THE_FORECAST_ACTIVITY_RANKINGS_FOR_SUITABILITY_RANGE_VALIDATION(): void {
    this.requestedCity = "London";
  }

  public async THE_API_RETURNS_THE_SUITABILITY_RANGE_RESPONSE(): Promise<void> {
    this.activityResponse = await this.activityRankingClient.getActivityRanking(
      this.requestedCity
    );
  }

  public VALIDATE_THAT_ALL_ACTIVITY_SUITABILITY_VALUES_ARE_BETWEEN_INT_AND_INT(
    minimumSuitability: number,
    maximumSuitability: number
  ): void {
    this.assert(
      this.actMgr.assertActivitySuitabilityValuesWithinRange(
        this.activityResponse,
        minimumSuitability,
        maximumSuitability
      ),
      "Success! All activity suitability values are between " +
        minimumSuitability +
        " and " +
        maximumSuitability +
        "!",
      "Fail! At least one activity suitability value is outside " +
        minimumSuitability +
        " and " +
        maximumSuitability +
        "!"
    );
  }
}
