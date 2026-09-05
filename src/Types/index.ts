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
