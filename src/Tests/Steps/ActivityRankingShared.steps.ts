import { world as cucumberWorld } from "@cucumber/cucumber";
import assert from "node:assert/strict";
import { MockCityActivitiesFactory } from "../../../fixtures/MockCityActivitiesFactory";
import { CityActivities } from "../../PageObjects/CityActivity/CityActivities";
import { CucumberWorld } from "../../Support/CucumberWorld";
import type { CityActivity, CityNotFoundError } from "../../Types";

const REQUESTED_CITY_KEY = "activityRanking.requestedCity";
const PENDING_RESPONSE_KEY = "activityRanking.pendingResponse";
const RESPONSE_KEY = "activityRanking.response";

export class ActivityRankingSharedSteps {
  private readonly fixtures = new MockCityActivitiesFactory();

  private get world(): CucumberWorld {
    return cucumberWorld as CucumberWorld;
  }

  public QUEUE_UNIQUE_CITY_RESPONSE(): void {
    this.queueCityResponse("London", this.fixtures.returnMockDataForCity("London"));
  }

  public QUEUE_FORECAST_ACTIVITY_RESPONSE(): void {
    const response = this.fixtures.returnWeatherSensitiveMockData("London");
    this.queueCityResponse("London", response);
    this.world.setData("activityRanking.expectedResponse", this.fixtures.returnWeatherSensitiveMockData("London"));
  }

  public QUEUE_VALID_CITY_RESPONSE(): void {
    this.QUEUE_FORECAST_ACTIVITY_RESPONSE();
  }

  public QUEUE_PARTIAL_CITY_RESULTS(partialCity: string, cityNames: string[]): void {
    this.world.setData(REQUESTED_CITY_KEY, partialCity);
    this.world.setData(PENDING_RESPONSE_KEY, this.fixtures.getNamedCityActivities(cityNames));
  }

  public QUEUE_CITY_NOT_FOUND_RESPONSE(cityName: string): void {
    this.world.setData(REQUESTED_CITY_KEY, cityName);
    this.world.setData(PENDING_RESPONSE_KEY, this.fixtures.returnCityNotFoundError(cityName));
  }

  public THE_API_RETURNS_THE_RESPONSE(): void {
    this.world.setData(RESPONSE_KEY, this.requirePendingResponse());
  }

  public getRequestedCity(): string {
    const city = this.world.getData<string>(REQUESTED_CITY_KEY);
    assert.ok(city, "Expected a requested city in the scenario state.");
    return city;
  }

  public getCityResponse(): CityActivity {
    const response = this.world.getData<unknown>(RESPONSE_KEY);
    assert.ok(this.isCityActivity(response), "Expected a city activity response.");
    return response;
  }

  public getCityResults(): CityActivity[] {
    const response = this.world.getData<unknown>(RESPONSE_KEY);
    assert.ok(Array.isArray(response), "Expected a city search result collection.");
    return response as CityActivity[];
  }

  public getCityNotFoundError(): CityNotFoundError {
    const response = this.world.getData<unknown>(RESPONSE_KEY);
    assert.ok(this.isCityNotFoundError(response), "Expected a city-not-found error response.");
    return response;
  }

  public getCityActivities(response: CityActivity | CityActivity[]): CityActivities {
    return new CityActivities(response);
  }

  public getExpectedResponse(): CityActivity {
    const response = this.world.getData<unknown>("activityRanking.expectedResponse");
    assert.ok(this.isCityActivity(response), "Expected a deterministic activity response.");
    return response;
  }

  private queueCityResponse(cityName: string, response: CityActivity): void {
    this.world.setData(REQUESTED_CITY_KEY, cityName);
    this.world.setData(PENDING_RESPONSE_KEY, response);
  }

  private requirePendingResponse(): unknown {
    const response = this.world.getData<unknown>(PENDING_RESPONSE_KEY);
    assert.notEqual(response, undefined, "Expected a queued fixture response.");
    return response;
  }

  private isCityActivity(value: unknown): value is CityActivity {
    return typeof value === "object" && value !== null && "forecastDays" in value && "name" in value;
  }

  private isCityNotFoundError(value: unknown): value is CityNotFoundError {
    return typeof value === "object" && value !== null && "error" in value;
  }
}
