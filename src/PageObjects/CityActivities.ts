import type {
    Activity,
    CityActivity,
    forecastDays as ForecastDay
} from "../Types/index";

export const SUPPORTED_ACTIVITY_NAMES = [
    "Skiing",
    "Surfing",
    "Outdoor Sightseeing",
    "Indoor Sightseeing"
] as const;


export class CityActivities {
    private readonly cityActivities: CityActivity[];

    public constructor(cityActivities: CityActivity | CityActivity[]) {
        this.cityActivities = Array.isArray(cityActivities)
            ? [...cityActivities]
            : [cityActivities];
    }

    public getAllCityActivities(): CityActivity[] {
        return [...this.cityActivities];
    }

    public getActivitiesByCityName(
        cityName: string
    ): CityActivity | undefined {
        const expectedName = this.normalizeText(cityName);

        if (!expectedName) {
            return undefined;
        }

        return this.cityActivities.find(
            (cityActivity) =>
                this.normalizeText(cityActivity.name) === expectedName
        );
    }

    public getActivitiesByPartialCityName(
        partialCityName: string,
        limit: number = 10
    ): CityActivity[] {
        const expectedPartialName = this.normalizeText(partialCityName);

        if (!expectedPartialName) {
            return [];
        }

        if (!Number.isInteger(limit) || limit < 1) {
            throw new RangeError("The partial city result limit must be a positive integer.");
        }

        return this.cityActivities
            .filter((cityActivity) =>
                this.normalizeText(cityActivity.name).includes(
                    expectedPartialName
                )
            )
            .slice(0, limit);
    }

    public assertCityActivityExists(
        cityActivity: CityActivity | null | undefined
    ): boolean {
        return Boolean(
            cityActivity &&
            typeof cityActivity.name === "string" &&
            cityActivity.name.trim().length > 0
        );
    }

    public assertCityNameMatches(
        cityActivity: CityActivity,
        expectedCityName: string
    ): boolean {
        return this.normalizeText(cityActivity.name) ===
            this.normalizeText(expectedCityName);
    }

    public assertCityDoesNotExist(cityName: string): boolean {
        return this.getActivitiesByCityName(cityName) === undefined;
    }

    public assertPartialCityResultsMatch(
        partialCityName: string,
        results: CityActivity[]
    ): boolean {
        const expectedPartialName = this.normalizeText(partialCityName);

        return expectedPartialName.length > 0 &&
            results.length > 0 &&
            results.every((result) =>
                this.normalizeText(result.name).includes(expectedPartialName)
            );
    }

    public assertPartialCityResultsAreLimited(
        results: CityActivity[],
        maximumResults: number
    ): boolean {
        return Number.isInteger(maximumResults) &&
            maximumResults > 0 &&
            results.length <= maximumResults;
    }


    public getForecastDays(cityActivity: CityActivity): ForecastDay[] {
        return [...cityActivity.forecastDays];
    }

    public getForecastDayByDate(
        cityActivity: CityActivity,
        date: string
    ): ForecastDay | undefined {
        return cityActivity.forecastDays.find((forecastDay) =>
            this.areSameCalendarDate(forecastDay.date, date)
        );
    }

    public getActivitiesByDate(
        cityActivity: CityActivity,
        date: string
    ): Activity[] {
        const forecastDay = this.getForecastDayByDate(cityActivity, date);
        return forecastDay ? [...forecastDay.activities] : [];
    }

    public getActivityByNameAndDate(
        cityActivity: CityActivity,
        date: string,
        activityName: string
    ): Activity | undefined {
        const expectedActivityName = this.normalizeText(activityName);

        return this.getActivitiesByDate(cityActivity, date).find(
            (activity) =>
                this.normalizeText(activity.activityName) ===
                expectedActivityName
        );
    }

    public getHighestRankedActivityByDate(
        cityActivity: CityActivity,
        date: string
    ): Activity | undefined {
        return this.getActivitiesByDate(cityActivity, date).reduce<
            Activity | undefined
        >(
            (highest, activity) =>
                !highest ||
                activity.activitySuitability > highest.activitySuitability
                    ? activity
                    : highest,
            undefined
        );
    }


    public assertCurrentDateExists(cityActivity: CityActivity): boolean {
        return typeof cityActivity.currentDate === "string" &&
            cityActivity.currentDate.trim().length > 0 &&
            this.parseCalendarDate(cityActivity.currentDate) !== undefined;
    }

    public assertForecastHasExactlyDays(
        cityActivity: CityActivity,
        expectedDays: number = 7
    ): boolean {
        return Number.isInteger(expectedDays) &&
            expectedDays > 0 &&
            cityActivity.forecastDays.length === expectedDays;
    }

    public assertForecastStartsOnNextDay(
        cityActivity: CityActivity
    ): boolean {
        const currentDate = this.parseCalendarDate(cityActivity.currentDate);
        const firstForecastDate = this.parseCalendarDate(
            cityActivity.forecastDays[0]?.date ?? ""
        );

        if (!currentDate || !firstForecastDate) {
            return false;
        }

        return this.daysBetween(currentDate, firstForecastDate) === 1;
    }

    public assertForecastDatesAreValid(
        cityActivity: CityActivity
    ): boolean {
        return cityActivity.forecastDays.length > 0 &&
            cityActivity.forecastDays.every(
                (forecastDay) =>
                    typeof forecastDay.date === "string" &&
                    forecastDay.date.trim().length > 0 &&
                    this.parseCalendarDate(forecastDay.date) !== undefined
            );
    }

    public assertForecastDatesAreSequential(
        cityActivity: CityActivity
    ): boolean {
        if (!this.assertForecastDatesAreValid(cityActivity)) {
            return false;
        }

        for (let index = 1; index < cityActivity.forecastDays.length; index++) {
            const previousDate = this.parseCalendarDate(
                cityActivity.forecastDays[index - 1]?.date ?? ""
            );
            const currentDate = this.parseCalendarDate(
                cityActivity.forecastDays[index]?.date ?? ""
            );

            if (!previousDate || !currentDate ||
                this.daysBetween(previousDate, currentDate) !== 1) {
                return false;
            }
        }

        return true;
    }

    public assertForecastDatesAreUnique(
        cityActivity: CityActivity
    ): boolean {
        if (!this.assertForecastDatesAreValid(cityActivity)) {
            return false;
        }

        const dateKeys = cityActivity.forecastDays.map((forecastDay) =>
            this.toCalendarDateKey(forecastDay.date)
        );

        return new Set(dateKeys).size === dateKeys.length;
    }

    public assertActivitiesExistByDate(
        cityActivity: CityActivity,
        date: string
    ): boolean {
        return this.getActivitiesByDate(cityActivity, date).length > 0;
    }

    public assertEveryForecastDayHasActivities(
        cityActivity: CityActivity
    ): boolean {
        return cityActivity.forecastDays.length > 0 &&
            cityActivity.forecastDays.every(
                (forecastDay) => forecastDay.activities.length > 0
            );
    }

    public assertEveryForecastDayContainsAllSupportedActivities(
        cityActivity: CityActivity
    ): boolean {
        const supportedNames = SUPPORTED_ACTIVITY_NAMES.map((name) =>
            this.normalizeText(name)
        );

        return cityActivity.forecastDays.length > 0 &&
            cityActivity.forecastDays.every((forecastDay) => {
                const returnedNames = forecastDay.activities.map((activity) =>
                    this.normalizeText(activity.activityName)
                );

                return returnedNames.length === supportedNames.length &&
                    new Set(returnedNames).size === supportedNames.length &&
                    supportedNames.every((name) =>
                        returnedNames.includes(name)
                    );
            });
    }

    public assertActivityFieldsAreValid(
        cityActivity: CityActivity
    ): boolean {
        return cityActivity.forecastDays.length > 0 &&
            cityActivity.forecastDays.every((forecastDay) =>
                forecastDay.activities.length > 0 &&
                forecastDay.activities.every((activity) =>
                    typeof activity.activityName === "string" &&
                    activity.activityName.trim().length > 0 &&
                    typeof activity.activitySuitability === "number" &&
                    typeof activity.activityReason === "string"
                )
            );
    }

    public assertActivitySuitabilityValuesAreValid(
        cityActivity: CityActivity
    ): boolean {
        return cityActivity.forecastDays.length > 0 &&
            cityActivity.forecastDays.every((forecastDay) =>
                forecastDay.activities.length > 0 &&
                forecastDay.activities.every((activity) =>
                    Number.isFinite(activity.activitySuitability) &&
                    activity.activitySuitability >= 0 &&
                    activity.activitySuitability <= 100
                )
            );
    }

    public assertActivityReasoningIsValid(
        cityActivity: CityActivity
    ): boolean {
        return cityActivity.forecastDays.length > 0 &&
            cityActivity.forecastDays.every((forecastDay) =>
                forecastDay.activities.length > 0 &&
                forecastDay.activities.every((activity) =>
                    typeof activity.activityReason === "string" &&
                    activity.activityReason.trim().length > 0
                )
            );
    }

    public assertActivitiesAreRankedBySuitability(
        cityActivity: CityActivity
    ): boolean {
        return cityActivity.forecastDays.length > 0 &&
            cityActivity.forecastDays.every((forecastDay) => {
                for (
                    let index = 1;
                    index < forecastDay.activities.length;
                    index++
                ) {
                    const previousScore =
                        forecastDay.activities[index - 1]
                            ?.activitySuitability;
                    const currentScore =
                        forecastDay.activities[index]
                            ?.activitySuitability;

                    if (previousScore === undefined ||
                        currentScore === undefined ||
                        previousScore < currentScore) {
                        return false;
                    }
                }

                return forecastDay.activities.length > 0;
            });
    }

    public assertActivityDataIsValid(cityActivity: CityActivity): boolean {
        return this.assertEveryForecastDayContainsAllSupportedActivities(
            cityActivity
        ) &&
            this.assertActivityFieldsAreValid(cityActivity) &&
            this.assertActivitySuitabilityValuesAreValid(cityActivity) &&
            this.assertActivityReasoningIsValid(cityActivity);
    }

    public assertActivitySuitabilityMatchesExpectedByDate(
        cityActivity: CityActivity,
        date: string,
        activityName: string,
        expectedSuitability: number
    ): boolean {
        const activity = this.getActivityByNameAndDate(
            cityActivity,
            date,
            activityName
        );

        return activity?.activitySuitability === expectedSuitability;
    }

    public assertActivityReasoningMatchesExpectedByDate(
        cityActivity: CityActivity,
        date: string,
        activityName: string,
        expectedReasoning: string
    ): boolean {
        const activity = this.getActivityByNameAndDate(
            cityActivity,
            date,
            activityName
        );

        return activity?.activityReason === expectedReasoning;
    }

    public assertCityActivityMatchesExpected(
        actual: CityActivity,
        expected: CityActivity
    ): boolean {
        if (actual.name !== expected.name ||
            actual.currentDate !== expected.currentDate ||
            actual.forecastDays.length !== expected.forecastDays.length) {
            return false;
        }

        return expected.forecastDays.every((expectedDay, dayIndex) => {
            const actualDay = actual.forecastDays[dayIndex];

            if (!actualDay ||
                actualDay.date !== expectedDay.date ||
                actualDay.activities.length !== expectedDay.activities.length) {
                return false;
            }

            return expectedDay.activities.every(
                (expectedActivity, activityIndex) => {
                    const actualActivity =
                        actualDay.activities[activityIndex];

                    return Boolean(
                        actualActivity &&
                        actualActivity.activityName ===
                            expectedActivity.activityName &&
                        actualActivity.activitySuitability ===
                            expectedActivity.activitySuitability &&
                        actualActivity.activityReason ===
                            expectedActivity.activityReason
                    );
                }
            );
        });
    }

    private normalizeText(value: string): string {
        return value.trim().toLowerCase();
    }

    private areSameCalendarDate(
        firstDate: string,
        secondDate: string
    ): boolean {
        const firstDateKey = this.toCalendarDateKey(firstDate);
        const secondDateKey = this.toCalendarDateKey(secondDate);

        return firstDateKey !== undefined &&
            firstDateKey === secondDateKey;
    }

    private toCalendarDateKey(dateValue: string): string | undefined {
        const date = this.parseCalendarDate(dateValue);

        if (!date) {
            return undefined;
        }

        return [
            date.getUTCFullYear(),
            String(date.getUTCMonth() + 1).padStart(2, "0"),
            String(date.getUTCDate()).padStart(2, "0")
        ].join("-");
    }

    private parseCalendarDate(dateValue: string): Date | undefined {
        const trimmedDate = dateValue.trim();
        const isoMatch = /^(\d{4})-(\d{2})-(\d{2})$/.exec(trimmedDate);

        if (isoMatch) {
            const year = Number(isoMatch[1]);
            const month = Number(isoMatch[2]);
            const day = Number(isoMatch[3]);
            const parsedDate = new Date(Date.UTC(year, month - 1, day));

            const isValidDate =
                parsedDate.getUTCFullYear() === year &&
                parsedDate.getUTCMonth() === month - 1 &&
                parsedDate.getUTCDate() === day;

            return isValidDate ? parsedDate : undefined;
        }

        const parsedDate = new Date(trimmedDate);

        if (Number.isNaN(parsedDate.getTime())) {
            return undefined;
        }

        return new Date(Date.UTC(
            parsedDate.getFullYear(),
            parsedDate.getMonth(),
            parsedDate.getDate()
        ));
    }

    private daysBetween(firstDate: Date, secondDate: Date): number {
        const millisecondsPerDay = 24 * 60 * 60 * 1000;
        return Math.round(
            (secondDate.getTime() - firstDate.getTime()) /
            millisecondsPerDay
        );
    }
}
