import type {
    OpenMeteoDailyWeather,
    OpenMeteoForecastResponse,
    OpenMeteoLocation
} from "./OpenMeteoTypes";

const CITY_FIXTURES: readonly OpenMeteoLocation[] = [
    {
        id: 2643743,
        name: "London",
        latitude: 51.5085,
        longitude: -0.1257,
        country: "United Kingdom",
        timezone: "Europe/London"
    },
    {
        id: 5128581,
        name: "New York",
        latitude: 40.7143,
        longitude: -74.006,
        country: "United States",
        timezone: "America/New_York"
    },
    {
        id: 5368361,
        name: "Los Angeles",
        latitude: 34.0522,
        longitude: -118.2437,
        country: "United States",
        timezone: "America/Los_Angeles"
    },
    {
        id: 4887398,
        name: "Chicago",
        latitude: 41.85003,
        longitude: -87.65005,
        country: "United States",
        timezone: "America/Chicago"
    },
    {
        id: 4699066,
        name: "Houston",
        latitude: 29.76328,
        longitude: -95.36327,
        country: "United States",
        timezone: "America/Chicago"
    },
    {
        id: 5308655,
        name: "Phoenix",
        latitude: 33.44838,
        longitude: -112.07404,
        country: "United States",
        timezone: "America/Phoenix"
    },
    {
        id: 4560349,
        name: "Philadelphia",
        latitude: 39.95233,
        longitude: -75.16379,
        country: "United States",
        timezone: "America/New_York"
    },
    {
        id: 4726206,
        name: "San Antonio",
        latitude: 29.42412,
        longitude: -98.49363,
        country: "United States",
        timezone: "America/Chicago"
    },
    {
        id: 5391811,
        name: "San Diego",
        latitude: 32.71571,
        longitude: -117.16472,
        country: "United States",
        timezone: "America/Los_Angeles"
    },
    {
        id: 4684888,
        name: "Dallas",
        latitude: 32.78306,
        longitude: -96.80667,
        country: "United States",
        timezone: "America/Chicago"
    },
    {
        id: 5392171,
        name: "San Jose",
        latitude: 37.33939,
        longitude: -121.89496,
        country: "United States",
        timezone: "America/Los_Angeles"
    }
];

const WEATHER_PATTERN = [
    {
        maximumTemperature: -2,
        minimumTemperature: -8,
        precipitation: 0.1,
        snowfall: 12,
        wind: 8,
        weatherCode: 71
    },
    {
        maximumTemperature: 18,
        minimumTemperature: 9,
        precipitation: 0,
        snowfall: 0,
        wind: 6,
        weatherCode: 1
    },
    {
        maximumTemperature: 12,
        minimumTemperature: 7,
        precipitation: 8.4,
        snowfall: 0,
        wind: 28,
        weatherCode: 63
    },
    {
        maximumTemperature: 20,
        minimumTemperature: 11,
        precipitation: 0,
        snowfall: 0,
        wind: 7,
        weatherCode: 0
    },
    {
        maximumTemperature: 0,
        minimumTemperature: -6,
        precipitation: 0.2,
        snowfall: 9,
        wind: 10,
        weatherCode: 73
    },
    {
        maximumTemperature: 15,
        minimumTemperature: 8,
        precipitation: 1.2,
        snowfall: 0,
        wind: 12,
        weatherCode: 3
    },
    {
        maximumTemperature: 19,
        minimumTemperature: 10,
        precipitation: 0,
        snowfall: 0,
        wind: 5,
        weatherCode: 0
    }
] as const;

export function getCityFixtures(): OpenMeteoLocation[] {
    return CITY_FIXTURES.map((location) => ({ ...location }));
}

export function createForecastResponse(
    latitude: number,
    longitude: number,
    timezone: string,
    startDate: string
): OpenMeteoForecastResponse {
    const dates = createForecastDates(startDate);
    const daily = createDailyWeather(dates);

    return { latitude, longitude, timezone, daily };
}

function createForecastDates(startDate: string): string[] {
    const parsedStartDate = parseUtcDate(startDate);

    return WEATHER_PATTERN.map((_, index) => {
        const forecastDate = new Date(parsedStartDate);
        forecastDate.setUTCDate(forecastDate.getUTCDate() + index);
        return forecastDate.toISOString().slice(0, 10);
    });
}

function createDailyWeather(dates: string[]): OpenMeteoDailyWeather {
    return {
        time: dates,
        temperature_2m_max: WEATHER_PATTERN.map(
            (day) => day.maximumTemperature
        ),
        temperature_2m_min: WEATHER_PATTERN.map(
            (day) => day.minimumTemperature
        ),
        precipitation_sum: WEATHER_PATTERN.map(
            (day) => day.precipitation
        ),
        snowfall_sum: WEATHER_PATTERN.map((day) => day.snowfall),
        wind_speed_10m_max: WEATHER_PATTERN.map((day) => day.wind),
        weather_code: WEATHER_PATTERN.map((day) => day.weatherCode)
    };
}

function parseUtcDate(dateValue: string): Date {
    const parsedDate = new Date(`${dateValue}T00:00:00.000Z`);

    if (Number.isNaN(parsedDate.getTime())) {
        throw new RangeError(`Invalid Open-Meteo start date: ${dateValue}`);
    }

    return parsedDate;
}
