export enum Wheater {
    RAINING = "Raining",
    SNOWING = "Snowing",
    SUNNY = "Sunny",
    CLOUDY = "Cloudy",
    CLEAR = "Clear",
    COLD = "Cold",
    HOT = "Hot",
    MILD = "Mild"
}

export type Activity = {
    activityName: string;
    activitySuitability: number;
    activityReason: string;
};

export type forecastDays = {
    date: string;
    activities: Activity[];
};

export type CityActivity = {
    name: string;
    currentDate: string;
    forecastDays: forecastDays[];
};

export type ScoreAndReason = {
    activitySuitability: number;
    reason: string;
};

export type CityNotFoundError = {
    error: string;
};

export interface ActivityRankingClient {
    getActivityRanking(city: string): Promise<CityActivity>;

    searchCities(
        partialName: string,
        limit?: number
    ): Promise<CityActivity[]>;
}

export type ActivityRankingQuery = Record<
    string,
    string | number | undefined
>;

export interface ActivityRankingHttpResponse<T = unknown> {
    status: number;
    statusText: string;
    headers: Headers;
    body: T | string | null;
    url: string;
}

export type ActivityRankingErrorBody = {
    error?: string;
    message?: string;
};
