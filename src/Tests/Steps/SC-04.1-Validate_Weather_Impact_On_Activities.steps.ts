import { BaseClass } from "src/BaseClass";
import type { CityActivity } from "src/Types";

export class Sc041ValidateWeatherImpactOnActivitiesSteps extends BaseClass {
  public requestedCity = "";
  public activityResponse!: CityActivity;

  public THE_USER_REQUESTS_THE_FORECAST_ACTIVITY_RANKINGS_FOR_WEATHER_IMPACT_VALIDATION(): void {
    this.requestedCity = "London";
  }

  public async THE_API_RETURNS_THE_WEATHER_SENSITIVE_RANKINGS_RESPONSE(): Promise<void> {
    this.activityResponse = await this.activityRankingClient.getActivityRanking(
      this.requestedCity
    );
  }

  public VALIDATE_THAT_ACTIVITY_SUITABILITY_IS_DETERMINED_BASED_ON_THE_WEATHER_CONDITIONS_FOR_EACH_FORECAST_DAY(): void {
    this.assert(
      this.actMgr.assertWeatherSensitiveActivitySuitability(this.activityResponse),
      "Success! Weather-sensitive suitability scores match every forecast day!",
      "Fail! Weather-sensitive suitability scores do not match every forecast day!"
    );
  }
}
