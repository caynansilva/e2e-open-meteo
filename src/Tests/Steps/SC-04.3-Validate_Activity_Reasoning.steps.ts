import { BaseClass } from "src/BaseClass";
import type { CityActivity } from "src/Types";

export class Sc043ValidateActivityReasoningSteps extends BaseClass {
  public requestedCity = "";
  public activityResponse!: CityActivity;

  public THE_USER_REQUESTS_THE_FORECAST_ACTIVITY_RANKINGS_FOR_ACTIVITY_REASONING_VALIDATION(): void {
    this.requestedCity = "London";
  }

  public async THE_API_RETURNS_THE_ACTIVITY_REASONING_RESPONSE(): Promise<void> {
    this.activityResponse = await this.activityRankingClient.getActivityRanking(
      this.requestedCity
    );
  }

  public VALIDATE_THAT_EVERY_ACTIVITY_INCLUDES_REASONING_EXPLAINING_ITS_SUITABILITY(): void {
    this.assert(
      this.actMgr.assertActivityReasoningIsValid(this.activityResponse),
      "Success! Every activity includes suitability reasoning!",
      "Fail! At least one activity does not include suitability reasoning!"
    );
  }
}
