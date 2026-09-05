import { BaseClass } from "src/BaseClass";

export class Sc041ValidateWeatherImpactOnActivitiesSteps extends BaseClass {
  public requestedCityName: string;

  constructor() {
    super();
    this.testName = "[SC-04.1] - Weather conditions impact activity suitability rankings";
    this.startTestMessage();
  }

  public THE_USER_REQUESTS_THE_FORECAST_ACTIVITY_RANKINGS_FOR_WEATHER_IMPACT_VALIDATION(): void {
    this.requestedCityName = "London";
  }

  public THE_API_RETURNS_THE_WEATHER_SENSITIVE_RANKINGS_RESPONSE(): void {
    this.activityObject = this.mockData.returnWeatherSensitiveMockData(
      this.requestedCityName
    );
    this.actMgr.setCityActivities([this.activityObject]);
  }

  public VALIDATE_THAT_ACTIVITY_SUITABILITY_IS_DETERMINED_BASED_ON_THE_WEATHER_CONDITIONS_FOR_EACH_FORECAST_DAY(): void {
    this.assert(
      this.actMgr.assertWeatherSensitiveActivitySuitability(
        this.activityObject
      ),
      "Success! Weather-sensitive suitability scores match every forecast day!",
      "Fail! Weather-sensitive suitability scores do not match every forecast day!"
    );
  }
}
