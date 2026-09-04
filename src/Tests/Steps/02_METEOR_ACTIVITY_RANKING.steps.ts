import { DataTable, world as cucumberWorld } from "@cucumber/cucumber";
import assert from "node:assert/strict";
import { CucumberApiResponse, CucumberWorld } from "../../Support/CucumberWorld";
import { ActivityRankingApiClient } from "../api/ActivityRankingApiClient";

export class ActivityRankingSteps {
  private get world(): CucumberWorld {
    return cucumberWorld as CucumberWorld;
  }

  public INITIALIZE_API(): void {
    const apiClient = new ActivityRankingApiClient();

    this.world.setData("activityRankingApi", apiClient);
    this.world.setData("activityRankingApiUrl", apiClient.getApiBaseUrl());
  }

  public async REQUEST_RANKINGS(city: string): Promise<void> {
    const apiClient = this.world.getData<ActivityRankingApiClient>("activityRankingApi") ?? new ActivityRankingApiClient();

    this.world.lastApiResponse = await apiClient.requestRankings(city);
  }

  public VERIFY_RESPONSE_STATUS(status: number): void {
    assert.equal(this.requireApiResponse().status, status);
  }

  public VERIFY_RANKING_DAYS(days: number): void {
    assert.equal(getDays(this.requireApiResponse().body).length, days);
  }

  public VERIFY_EVERY_DAY_RANKS(dataTable: DataTable): void {
    const expectedActivities = dataTable.raw().flat();
    const rankingDays = getDays(this.requireApiResponse().body);

    for (const rankingDay of rankingDays) {
      assertRankingDay(rankingDay, expectedActivities);
    }
  }

  public VERIFY_CITY_MATCHES(): void {
    const body = requireObject(this.requireApiResponse().body, "response body");
    const matches = requireArray(body.matches, "matches");

    assert.ok(matches.length > 0, "Expected one or more matching cities.");
  }

  public VERIFY_CITY_NOT_FOUND(): void {
    const body = requireObject(this.requireApiResponse().body, "response body");

    assert.equal(typeof body.error, "string", "Expected an error message for an unknown city.");
  }

  private requireApiResponse(): CucumberApiResponse {
    assert.ok(this.world.lastApiResponse, "Expected an API response from the previous request.");
    return this.world.lastApiResponse;
  }
}

function getDays(body: unknown): unknown[] {
  const response = requireObject(body, "response body");
  return requireArray(response.days, "days");
}

function assertRankingDay(day: unknown, expectedActivities: string[]): void {
  const rankingDay = requireObject(day, "ranking day");
  assert.equal(typeof rankingDay.date, "string", "Expected each ranking day to include a date.");

  const rankings = requireArray(rankingDay.activities, "activities");
  assert.equal(rankings.length, expectedActivities.length, "Expected all requested activities per day.");

  for (const activity of expectedActivities) {
    assertActivityRanking(rankings, activity);
  }
}

function assertActivityRanking(rankings: unknown[], activityName: string): void {
  const ranking = rankings.find((entry) => getActivityName(entry) === activityName);
  const activity = requireObject(ranking, `ranking for ${activityName}`);

  assert.ok(Number.isInteger(activity.score), `Expected ${activityName} score to be an integer.`);
  assert.ok(
    (activity.score as number) >= 0 && (activity.score as number) <= 100,
    `Expected ${activityName} score between 0 and 100.`
  );
  assert.ok(typeof activity.reason === "string" && activity.reason.trim().length > 0, `Expected ${activityName} reason.`);
}

function getActivityName(entry: unknown): string | undefined {
  if (!isRecord(entry) || typeof entry.name !== "string") {
    return undefined;
  }

  return entry.name;
}

function requireObject(value: unknown, label: string): Record<string, unknown> {
  assert.ok(isRecord(value), `Expected ${label} to be an object.`);
  return value;
}

function requireArray(value: unknown, label: string): unknown[] {
  assert.ok(Array.isArray(value), `Expected ${label} to be an array.`);
  return value;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}
