import { BaseClass } from "src/BaseClass";
import type { CityActivity } from "src/Types";

export class Sc052ValidateActivityRankingOrderSteps extends BaseClass {
  public requestedCity = "";
  public activityResponse!: CityActivity;

  public THE_USER_REQUESTS_THE_FORECAST_ACTIVITY_RANKINGS_FOR_RANKING_ORDER_VALIDATION(): void {
    this.requestedCity = "London";
  }

  public async THE_API_RETURNS_THE_ORDERED_RANKINGS_RESPONSE(): Promise<void> {
    this.activityResponse = await this.activityRankingClient.getActivityRanking(
      this.requestedCity
    );
  }

  public VALIDATE_THAT_THE_ACTIVITIES_FOR_EACH_FORECAST_DAY_ARE_ORDERED_FROM_HIGHEST_TO_LOWEST_SUITABILITY(): void {
    this.assert(
      this.actMgr.assertActivitiesAreRankedBySuitability(this.activityResponse),
      "Success! Activities are ordered from highest to lowest suitability every forecast day!",
      "Fail! Activities are not ordered from highest to lowest suitability every forecast day!"
    );
  }
}
