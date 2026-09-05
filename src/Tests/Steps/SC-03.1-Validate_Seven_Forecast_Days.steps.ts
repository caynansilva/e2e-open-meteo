import { BaseClass } from "src/BaseClass";

export class Sc031ValidateSevenForecastDaysSteps extends BaseClass {
  public requestedCityName: string;

  constructor() {
    super();
    this.testName = "[SC-03.1] - Response contains exactly 7 forecast days";
    this.startTestMessage();
  }

  public THE_USER_SENDS_A_REQUEST_FOR_A_VALID_CITY(): void {
    this.requestedCityName = "London";
  }

  public THE_API_RETURNS_THE_RESPONSE(): void {
    this.activityObject = this.mockData.returnWeatherSensitiveMockData(
      this.requestedCityName
    );
    this.actMgr.setCityActivities([this.activityObject]);
  }

  public VALIDATE_THAT_THE_RESPONSE_CONTAINS_EXACTLY_INT_FORECAST_DAYS(expectedDays: number): void {
    this.assert(
      this.actMgr.assertForecastHasExactlyDays(
        this.activityObject,
        expectedDays
      ),
      `Success! The response contains exactly ${expectedDays} forecast days!`,
      `Fail! The response does not contain exactly ${expectedDays} forecast days!`
    );
  }
}
