import { BaseClass } from "src/BaseClass";

export class Sc022ValidateResponseRequiredFieldsSteps extends BaseClass {
  public requestedCityName: string;

  constructor() {
    super();
    this.testName = "[SC-02.2] - Validate that the response contract contains all required fields";
    this.startTestMessage();
  }

  public THE_USER_SENDS_A_REQUEST_WITH_A_VALID_AND_UNIQUE_CITY_NAME_FOR_RESPONSE_CONTRACT_VALIDATION(): void {
    this.requestedCityName = "London";
  }

  public THE_API_RETURNS_THE_CONTRACT_RESPONSE(): void {
    this.activityObject = this.mockData.returnWeatherSensitiveMockData(
      this.requestedCityName
    );
    this.actMgr.setCityActivities([this.activityObject]);
  }

  public VALIDATE_THAT_ALL_FIELDS_DEFINED_BY_THE_API_CONTRACT_ARE_PRESENT_IN_THE_RESPONSE(): void {
    this.assert(
      this.actMgr.assertResponseContractFieldsExist(this.activityObject),
      "Success! The response contains the required City Name, Current Date, and Forecast Days fields!",
      "Fail! The response does not contain all required City Name, Current Date, and Forecast Days fields!"
    );
  }
}
