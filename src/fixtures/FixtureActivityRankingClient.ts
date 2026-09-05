import { ActivityManager } from "../PageObjects/CityActivities";
import {
    cityNames,
    MockCityActivitiesFactory
} from "./MockCityActivitiesFactory";
import type {
    ActivityRankingClient,
    CityActivity
} from "../Types";

export class FixtureActivityRankingClient implements ActivityRankingClient {
    private readonly mockData: MockCityActivitiesFactory;

    constructor(mockData = new MockCityActivitiesFactory()) {
        this.mockData = mockData;
    }

    public async getActivityRanking(city: string): Promise<CityActivity> {
        if (this.isInvalidCity(city)) {
            const responseBody = this.mockData.returnCityNotFoundError(city);
            const requestUrl = this.createFixtureRequestUrl(city);

            throw new Error(
                `Activity Ranking API request failed: GET ${requestUrl} ` +
                `404 Not Found: ${JSON.stringify(responseBody)}`,
                { cause: responseBody }
            );
        }

        return this.mockData.returnWeatherSensitiveMockData(city);
    }

    public async searchCities(
        partialName: string,
        limit?: number
    ): Promise<CityActivity[]> {
        const activityManager = new ActivityManager();

        activityManager.setCityActivities(
            this.mockData.getNamedCityActivities(cityNames)
        );

        return activityManager.getActivitiesByPartialCityName(
            partialName,
            limit
        );
    }

    private isInvalidCity(city: string): boolean {
        return city.trim().toLowerCase() === "atlantis";
    }

    private createFixtureRequestUrl(city: string): string {
        const requestUrl = new URL(
            "/activities",
            "fixture://activity-ranking"
        );

        requestUrl.searchParams.set("city", city);
        return requestUrl.href;
    }
}
