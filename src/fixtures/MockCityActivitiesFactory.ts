import {
    CityActivity,
    forecastDays,
    Activity,
    ScoreAndReason,
    CityNotFoundError
} from "../Types/index";

import { WebHelper } from "../Utils/WebHelper";

export const cityNames = [
    "New York",
    "Los Angeles",
    "Chicago",
    "Houston",
    "Phoenix",
    "Philadelphia",
    "San Antonio",
    "San Diego",
    "Dallas",
    "San Jose"
];

export class MockCityActivitiesFactory {

    public getRandomCityName(): string {
        const randomIndex = Math.floor(Math.random() * cityNames.length);

        return cityNames[randomIndex] ?? cityNames[0] ?? "London";
    }

    public getRandomScore(): number {
        return Math.floor(Math.random() * 101);
    }

    public getRandomReason(): string {
        const reasons = [
            "Snow Day",
            "Sunny Day",
            "Rainy Day",
            "Cloudy Day"
        ];

        const randomIndex = Math.floor(Math.random() * reasons.length);

        return reasons[randomIndex] ?? reasons[0] ?? "Sunny Day";
    }

    public getRandomActivities(): Activity[] {
        const activities: Activity[] = [
            {
                activityName: "Surfing",
                activitySuitability: this.getRandomScore(),
                activityReason: this.getRandomReason()
            },
            {
                activityName: "Skiing",
                activitySuitability: this.getRandomScore(),
                activityReason: this.getRandomReason()
            },
            {
                activityName: "Indoor Sightseeing",
                activitySuitability: this.getRandomScore(),
                activityReason: this.getRandomReason()
            },
            {
                activityName: "Outdoor Sightseeing",
                activitySuitability: this.getRandomScore(),
                activityReason: this.getRandomReason()
            }
        ];

        return this.sortActivitiesBySuitability(activities);
    }

    public getActivitiesWithValues(
        surfing: ScoreAndReason,
        skiing: ScoreAndReason,
        indoor: ScoreAndReason,
        outdoor: ScoreAndReason
    ): Activity[] {

        const activities: Activity[] = [
            {
                activityName: "Surfing",
                activitySuitability: surfing.activitySuitability,
                activityReason: surfing.reason
            },
            {
                activityName: "Skiing",
                activitySuitability: skiing.activitySuitability,
                activityReason: skiing.reason
            },
            {
                activityName: "Indoor Sightseeing",
                activitySuitability: indoor.activitySuitability,
                activityReason: indoor.reason
            },
            {
                activityName: "Outdoor Sightseeing",
                activitySuitability: outdoor.activitySuitability,
                activityReason: outdoor.reason
            }
        ];

        return this.sortActivitiesBySuitability(activities);
    }

    public getForecastDaysRandomData(
        currentDate: string
    ): forecastDays[] {

        const nextSevenDays: forecastDays[] = [];

        for (let day = 1; day <= 7; day++) {
            nextSevenDays.push({
                date: WebHelper.getSumDate(currentDate, day),
                activities: this.getRandomActivities()
            });
        }

        return nextSevenDays;
    }

    public getForecastDaysDataWithValues(
        currentDate: string,
        activitiesByDay: Activity[][]
    ): forecastDays[] {

        if (activitiesByDay.length !== 7) {
            throw new Error(
                "Exactly 7 days of activity data must be provided."
            );
        }

        return activitiesByDay.map((activities, index) => ({
            date: WebHelper.getSumDate(currentDate, index + 1),
            activities: this.sortActivitiesBySuitability(activities)
        }));
    }

    public returnMockDataForCity(
        cityName: string
    ): CityActivity {

        const currentDate = WebHelper.getCurrentDate();

        return {
            name: cityName,
            currentDate,
            forecastDays: this.getForecastDaysRandomData(currentDate)
        };
    }

    public returnMockDataForCityWithValues(
        cityName: string,
        activitiesByDay: Activity[][]
    ): CityActivity {

        const currentDate = WebHelper.getCurrentDate();

        return {
            name: cityName,
            currentDate,
            forecastDays: this.getForecastDaysDataWithValues(
                currentDate,
                activitiesByDay
            )
        };
    }

    public getNamedCityActivities(cityNames: string[]): CityActivity[] {
        return cityNames.map((cityName) => this.returnMockDataForCity(cityName));
    }

    public returnCityNotFoundError(cityName: string): CityNotFoundError {
        return { error: `City '${cityName}' could not be found.` };
    }

    public returnWeatherSensitiveMockData(cityName: string): CityActivity {
        const snowyActivities = this.getActivitiesWithValues(
            { activitySuitability: 10, reason: "No suitable surf conditions" },
            { activitySuitability: 95, reason: "High snowfall expected" },
            { activitySuitability: 30, reason: "Snowy weather limits sightseeing" },
            { activitySuitability: 45, reason: "Cold but dry conditions" }
        );
        const clearActivities = this.getActivitiesWithValues(
            { activitySuitability: 10, reason: "Limited wind for surfing" },
            { activitySuitability: 20, reason: "No snowfall expected" },
            { activitySuitability: 30, reason: "Good weather favors outdoor activities" },
            { activitySuitability: 85, reason: "Clear skies and mild temperature" }
        );

        return this.returnMockDataForCityWithValues(cityName, [
            snowyActivities,
            clearActivities,
            snowyActivities,
            clearActivities,
            snowyActivities,
            clearActivities,
            snowyActivities
        ]);
    }

    private sortActivitiesBySuitability(
        activities: Activity[]
    ): Activity[] {

        return [...activities].sort(
            (a, b) =>
                b.activitySuitability -
                a.activitySuitability
        );
    }
}
