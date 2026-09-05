import { BaseClass } from "src/BaseClass";

export class Sc042ValidateSupportedActivitiesSteps extends BaseClass {
  public requestedCityName: string;

  constructor() {
    super();
    this.testName = "[SC-04.2] - Every forecast day contains all supported activities";
    this.startTestMessage();
  }

  public THE_USER_REQUESTS_THE_FORECAST_ACTIVITY_RANKINGS_FOR_A_VALID_CITY(): void {
    this.requestedCityName = "London";
  }

  public THE_API_RETURNS_THE_RESPONSE(): void {
    this.activityObject = this.mockData.returnWeatherSensitiveMockData(
      this.requestedCityName
    );
    this.actMgr.setCityActivities([this.activityObject]);
  }

  public VALIDATE_THAT_EVERY_FORECAST_DAY_CONTAINS_ALL_SUPPORTED_ACTIVITIES(): void {
    this.assert(
      this.actMgr.assertEveryForecastDayContainsAllSupportedActivities(
        this.activityObject
      ),
      "Success! Every forecast day contains all supported activities!",
      "Fail! At least one forecast day does not contain all supported activities!"
    );
  }
}
