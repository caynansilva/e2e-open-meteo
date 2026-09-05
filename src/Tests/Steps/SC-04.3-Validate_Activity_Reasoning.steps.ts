import { BaseClass } from "src/BaseClass";
import type { CityActivity } from "src/Types";
import {
  CucumberWorld,
  WORLD_DATA_KEYS
} from "src/Support/CucumberWorld";

export class Sc043ValidateActivityReasoningSteps extends BaseClass {
  public THE_USER_REQUESTS_THE_FORECAST_ACTIVITY_RANKINGS_FOR_ACTIVITY_REASONING_VALIDATION(
    world: CucumberWorld
  ): void {
    world.setData(WORLD_DATA_KEYS.requestedCity, "London");
  }

  public async THE_API_RETURNS_THE_ACTIVITY_REASONING_RESPONSE(
    world: CucumberWorld
  ): Promise<void> {
    const requestedCity = this.getRequiredData<string>(
      world,
      WORLD_DATA_KEYS.requestedCity
    );
    const activityResponse =
      await this.activityRankingClient.getActivityRanking(requestedCity);

    world.setData(WORLD_DATA_KEYS.activityResponse, activityResponse);
  }

  public VALIDATE_THAT_EVERY_ACTIVITY_INCLUDES_REASONING_EXPLAINING_ITS_SUITABILITY(
    world: CucumberWorld
  ): void {
    const activityResponse = this.getRequiredData<CityActivity>(
      world,
      WORLD_DATA_KEYS.activityResponse
    );
    const activityManager = this.createActivityManager();

    this.assert(
      activityManager.assertActivityReasoningIsValid(activityResponse),
      "Success! Every activity includes suitability reasoning!",
      "Fail! At least one activity does not include suitability reasoning!"
    );
  }
}
