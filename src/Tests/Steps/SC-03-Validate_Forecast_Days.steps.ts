import assert from "node:assert/strict";
import { ActivityRankingSharedSteps } from "./ActivityRankingShared.steps";

export class Sc03ValidateForecastDaysSteps {
  private readonly shared = new ActivityRankingSharedSteps();

  public THE_USER_SENDS_A_REQUEST_FOR_A_VALID_CITY(): void {
    this.shared.QUEUE_VALID_CITY_RESPONSE();
  }

  public VALIDATE_THAT_THE_RESPONSE_CONTAINS_EXACTLY_INT_FORECAST_DAYS(expectedDays: number): void {
    const response = this.shared.getCityResponse();
    assert.ok(this.shared.getCityActivities(response).assertForecastHasExactlyDays(response, expectedDays), `Expected exactly ${expectedDays} forecast days.`);
  }

  public VALIDATE_THAT_THE_FORECAST_STARTS_FROM_THE_NEXT_DAY(): void {
    const response = this.shared.getCityResponse();
    assert.ok(this.shared.getCityActivities(response).assertForecastStartsOnNextDay(response), "Expected the forecast to start on the day after the current date.");
  }

  public VALIDATE_THAT_THE_CURRENT_DATE_IS_NOT_INCLUDED_IN_THE_FORECAST(): void {
    const response = this.shared.getCityResponse();
    const activities = this.shared.getCityActivities(response);
    assert.equal(activities.getForecastDayByDate(response, response.currentDate), undefined, "Expected the current date to be excluded from the forecast.");
  }

  public VALIDATE_THAT_THE_FORECAST_DATES_ARE_SEQUENTIAL(): void {
    const response = this.shared.getCityResponse();
    assert.ok(this.shared.getCityActivities(response).assertForecastDatesAreSequential(response), "Expected sequential forecast dates.");
  }

  public VALIDATE_THAT_THERE_ARE_NO_MISSING_OR_DUPLICATED_FORECAST_DAYS(): void {
    const response = this.shared.getCityResponse();
    assert.ok(this.shared.getCityActivities(response).assertForecastDatesAreUnique(response), "Expected forecast dates to be unique.");
  }
}
