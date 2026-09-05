import { BaseClass } from "src/BaseClass";

export class Sc043ValidateActivityReasoningSteps extends BaseClass {
  public requestedCityName: string;

  constructor() {
    super();
    this.testName = "[SC-04.3] - Every activity includes reasoning for its suitability";
    this.startTestMessage();
  }

  public THE_USER_REQUESTS_THE_FORECAST_ACTIVITY_RANKINGS_FOR_ACTIVITY_REASONING_VALIDATION(): void {
    this.requestedCityName = "London";
  }

  public THE_API_RETURNS_THE_ACTIVITY_REASONING_RESPONSE(): void {
    this.activityObject = this.mockData.returnWeatherSensitiveMockData(
      this.requestedCityName
    );
    this.actMgr.setCityActivities([this.activityObject]);
  }

  public VALIDATE_THAT_EVERY_ACTIVITY_INCLUDES_REASONING_EXPLAINING_ITS_SUITABILITY(): void {
    this.assert(
      this.actMgr.assertActivityReasoningIsValid(this.activityObject),
      "Success! Every activity includes suitability reasoning!",
      "Fail! At least one activity does not include suitability reasoning!"
    );
  }
}
