
import { BaseClass } from "src/BaseClass";

export class Sc01ValidateCitySearchAndResolutionSteps extends BaseClass {
  public randomCity: string;

  constructor(){
    super();
    this.testName = "[SC-01.1] - Retrieve activity rankings using an exact city name";
    this.startTestMessage();
  }
  
  public THE_USER_SENDS_A_REQUEST_WITH_A_VALID_AND_UNIQUE_CITY_NAME_FOR_EXACT_CITY_RESOLUTION(): void {
    this.randomCity = this.mockData.getRandomCityName();
  }

  public THE_API_RETURNS_THE_EXACT_CITY_RESPONSE(): void {
    this.activityObject = this.mockData.returnWeatherSensitiveMockData(this.randomCity);
  }

  public VALIDATE_THAT_THE_RETURNED_CITY_NAME_MATCHES_THE_CITY_PROVIDED_IN_THE_REQUEST(): void {
    this.actMgr.setCityActivities([this.activityObject]);
    
    this.assert(
      this.actMgr.assertCityActivityExists(this.activityObject),
      `Success! The field "City Name" exists in the contract!`,
      `Fail! The field "City Name" DOES NOT exists in the contract!`,
    );
    this.assert(
      this.actMgr.assertCityNameMatches(this.activityObject, this.randomCity),
      `Success! The field "CityName" matches the expected result "${this.randomCity}"!`,
      `Fail! The field "CityName" don't matches the expected result "${this.randomCity}"!`,
    )
  }
}
