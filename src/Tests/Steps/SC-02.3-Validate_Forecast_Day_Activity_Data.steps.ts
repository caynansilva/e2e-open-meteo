import { BaseClass } from "src/BaseClass";

export class Sc023ValidateForecastDayActivityDataSteps extends BaseClass {
  public requestedCityName: string;

  constructor() {
    super();
    this.testName = "[SC-02.3] - Each forecast day contains all required activity data";
    this.startTestMessage();
  }

  public THE_USER_REQUESTS_THE_FORECAST_ACTIVITY_RANKINGS_FOR_FORECAST_ACTIVITY_DATA(): void {
    this.requestedCityName = "London";
  }

  public THE_API_RETURNS_THE_FORECAST_ACTIVITY_DATA_RESPONSE(): void {
    this.activityObject = this.mockData.returnWeatherSensitiveMockData(
      this.requestedCityName
    );
    this.actMgr.setCityActivities([this.activityObject]);
  }

  public VALIDATE_THAT_EACH_FORECAST_DAY_CONTAINS_THE_REQUIRED_ACTIVITY_DATA(): void {
    this.assert(
      this.actMgr.assertEveryForecastDayHasActivities(this.activityObject),
      "Success! Every forecast day contains activity recommendations!",
      "Fail! At least one forecast day does not contain activity recommendations!"
    );
    this.assert(
      this.actMgr.assertActivityDataIsValid(this.activityObject),
      "Success! Every forecast day contains complete activity data!",
      "Fail! At least one forecast day does not contain complete activity data!"
    );
  }
}
