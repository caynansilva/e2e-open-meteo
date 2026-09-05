import { BaseClass } from "src/BaseClass";

export class Sc052ValidateActivityRankingOrderSteps extends BaseClass {
  public requestedCityName: string;

  constructor() {
    super();
    this.testName = "[SC-05.2] - Activities are ordered from highest to lowest suitability for each forecast day";
    this.startTestMessage();
  }

  public THE_USER_REQUESTS_THE_FORECAST_ACTIVITY_RANKINGS_FOR_RANKING_ORDER_VALIDATION(): void {
    this.requestedCityName = "London";
  }

  public THE_API_RETURNS_THE_ORDERED_RANKINGS_RESPONSE(): void {
    this.activityObject = this.mockData.returnWeatherSensitiveMockData(
      this.requestedCityName
    );
    this.actMgr.setCityActivities([this.activityObject]);
  }

  public VALIDATE_THAT_THE_ACTIVITIES_FOR_EACH_FORECAST_DAY_ARE_ORDERED_FROM_HIGHEST_TO_LOWEST_SUITABILITY(): void {
    this.assert(
      this.actMgr.assertActivitiesAreRankedBySuitability(this.activityObject),
      "Success! Activities are ordered from highest to lowest suitability every forecast day!",
      "Fail! Activities are not ordered from highest to lowest suitability every forecast day!"
    );
  }
}
