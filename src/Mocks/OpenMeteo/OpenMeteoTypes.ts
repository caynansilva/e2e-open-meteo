export type OpenMeteoLocation = {
    id: number;
    name: string;
    latitude: number;
    longitude: number;
    country: string;
    timezone: string;
};

export type OpenMeteoSearchResponse = {
    results: OpenMeteoLocation[];
};

export type OpenMeteoDailyWeather = {
    time: string[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    precipitation_sum: number[];
    snowfall_sum: number[];
    wind_speed_10m_max: number[];
    weather_code: number[];
};

export type OpenMeteoForecastResponse = {
    latitude: number;
    longitude: number;
    timezone: string;
    daily: OpenMeteoDailyWeather;
};

export type OpenMeteoRequest = {
    method: string;
    path: string;
    url: string;
    query: Record<string, string>;
};

export type OpenMeteoMockServerOptions = {
    host?: string;
    port?: number;
};
