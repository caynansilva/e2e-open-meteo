import type { CityActivity } from "../Types";

export interface ActivityRankingClient {
    getActivityRanking(city: string): Promise<CityActivity>;

    searchCities(
        partialName: string,
        limit?: number
    ): Promise<CityActivity[]>;
}
