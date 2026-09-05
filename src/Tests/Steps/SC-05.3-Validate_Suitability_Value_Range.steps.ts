import { BaseClass } from "src/BaseClass";

export class Sc053ValidateSuitabilityValueRangeSteps extends BaseClass {
  public requestedCityName: string;

  constructor() {
    super();
    this.testName = "[SC-05.3] - Suitability values remain within the accepted range";
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

  public VALIDATE_THAT_ALL_ACTIVITY_SUITABILITY_VALUES_ARE_BETWEEN_INT_AND_INT(
    minimumSuitability: number,
    maximumSuitability: number
  ): void {
    this.assert(
      this.actMgr.assertActivitySuitabilityValuesWithinRange(
        this.activityObject,
        minimumSuitability,
        maximumSuitability
      ),
      `Success! All activity suitability values are between ${minimumSuitability} and ${maximumSuitability}!`,
      `Fail! At least one activity suitability value is outside ${minimumSuitability} and ${maximumSuitability}!`
    );
  }
}
