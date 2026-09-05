import { ActivityManager } from "../PageObjects/CityActivities";
import {
    cityNames,
    MockCityActivitiesFactory
} from "../fixtures/MockCityActivitiesFactory";
import type { CityActivity } from "../Types";
import type { ActivityRankingClient } from "./ActivityRankingClient";
import { ActivityRankingApiError } from "./ActivityRankingErrors";

export class FixtureActivityRankingClient implements ActivityRankingClient {
    private readonly mockData: MockCityActivitiesFactory;

    constructor(mockData = new MockCityActivitiesFactory()) {
        this.mockData = mockData;
    }

    public async getActivityRanking(city: string): Promise<CityActivity> {
        if (this.isInvalidCity(city)) {
            throw new ActivityRankingApiError({
                status: 404,
                statusText: "Not Found",
                requestUrl: this.createFixtureRequestUrl(city),
                responseBody: this.mockData.returnCityNotFoundError(city)
            });
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
