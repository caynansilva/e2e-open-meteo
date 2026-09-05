import { BaseClass } from "src/BaseClass";

export class Sc032ValidateForecastStartDateSteps extends BaseClass {
  public requestedCityName: string;

  constructor() {
    super();
    this.testName = "[SC-03.2] - Forecast starts from the next day and does not include the current day";
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

  public VALIDATE_THAT_THE_FORECAST_STARTS_FROM_THE_NEXT_DAY(): void {
    this.assert(
      this.actMgr.assertForecastStartsOnNextDay(this.activityObject),
      "Success! The forecast starts on the next calendar day!",
      "Fail! The forecast does not start on the next calendar day!"
    );
  }

  public VALIDATE_THAT_THE_CURRENT_DATE_IS_NOT_INCLUDED_IN_THE_FORECAST(): void {
    this.assert(
      this.actMgr.assertForecastDoesNotIncludeCurrentDate(this.activityObject),
      "Success! The current date is not included in the forecast!",
      "Fail! The current date is included in the forecast!"
    );
  }
}
