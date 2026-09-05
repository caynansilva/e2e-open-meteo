import { BaseClass } from "src/BaseClass";

export class Sc033ValidateSequentialForecastDatesSteps extends BaseClass {
  public requestedCityName: string;

  constructor() {
    super();
    this.testName = "[SC-03.3] - Forecast dates are sequential without missing or duplicated days";
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

  public VALIDATE_THAT_THE_FORECAST_DATES_ARE_SEQUENTIAL(): void {
    this.assert(
      this.actMgr.assertForecastDatesAreSequential(this.activityObject),
      "Success! The forecast dates are sequential without missing days!",
      "Fail! The forecast dates are not sequential or contain missing days!"
    );
  }

  public VALIDATE_THAT_THERE_ARE_NO_MISSING_OR_DUPLICATED_FORECAST_DAYS(): void {
    this.assert(
      this.actMgr.assertForecastDatesAreUnique(this.activityObject),
      "Success! The forecast does not contain duplicated dates!",
      "Fail! The forecast contains duplicated dates!"
    );
  }
}
