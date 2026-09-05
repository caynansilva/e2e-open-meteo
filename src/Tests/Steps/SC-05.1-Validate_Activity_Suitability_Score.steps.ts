import { BaseClass } from "src/BaseClass";

export class Sc051ValidateActivitySuitabilityScoreSteps extends BaseClass {
  public requestedCityName: string;

  constructor() {
    super();
    this.testName = "[SC-05.1] - Activities have a suitability score from 0 to 100 for each forecast day";
    this.startTestMessage();
  }

  public THE_USER_REQUESTS_THE_FORECAST_ACTIVITY_RANKINGS_FOR_RANKED_ACTIVITY_LIST_VALIDATION(): void {
    this.requestedCityName = "London";
  }

  public THE_API_RETURNS_THE_RANKED_ACTIVITY_LIST_RESPONSE(): void {
    this.activityObject = this.mockData.returnWeatherSensitiveMockData(
      this.requestedCityName
    );
    this.actMgr.setCityActivities([this.activityObject]);
  }

  public VALIDATE_THAT_EACH_FORECAST_DAY_CONTAINS_A_RANKED_LIST_OF_ACTIVITIES(): void {
    this.assert(
      this.actMgr.assertEveryForecastDayHasActivities(this.activityObject),
      "Success! Every forecast day contains a ranked activity list!",
      "Fail! At least one forecast day does not contain a ranked activity list!"
    );
  }

  public VALIDATE_THAT_EACH_ACTIVITY_HAS_A_SUITABILITY_SCORE_BETWEEN_INT_AND_INT(
    minimumSuitability: number,
    maximumSuitability: number
  ): void {
    this.assert(
      this.actMgr.assertActivitySuitabilityValuesWithinRange(
        this.activityObject,
        minimumSuitability,
        maximumSuitability
      ),
      `Success! Every activity suitability score is between ${minimumSuitability} and ${maximumSuitability}!`,
      `Fail! At least one activity suitability score is outside ${minimumSuitability} and ${maximumSuitability}!`
    );
  }
}
