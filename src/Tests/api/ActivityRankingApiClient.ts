import { Environment } from "../../Utils/Environment";
import { WebHelper } from "../../Utils/WebHelper";

const DAILY_VARIABLES = [
  "weather_code",
  "temperature_2m_max",
  "temperature_2m_min",
  "precipitation_sum",
  "snowfall_sum",
  "wind_speed_10m_max",
  "sunshine_duration"
].join(",");

export interface ActivityRankingApiResponse {
  status: number;
  statusText: string;
  body: unknown;
  headers: Headers;
}

interface GeocodingPlace {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  country?: string;
  admin1?: string;
  timezone?: string;
}

interface DailyConditions {
  weatherCode: number;
  temperatureMax: number;
  temperatureMin: number;
  precipitation: number;
  snowfall: number;
  windSpeed: number;
}

export class ActivityRankingApiClient {
  private readonly forecastApiUrl: string;
  private readonly geocodingApiUrl: string;

  constructor(
    forecastApiUrl: string = Environment.getApiUrl(),
    geocodingApiUrl: string = Environment.getGeocodingApiUrl()
  ) {
    this.forecastApiUrl = forecastApiUrl;
    this.geocodingApiUrl = geocodingApiUrl;
  }

  public async requestRankings(city: string): Promise<ActivityRankingApiResponse> {
    const geocodingResponse = await WebHelper.sendAPIRequest(this.createGeocodingUrl(city), "GET");
    const places = this.getPlaces(geocodingResponse.body);

    if (places.length === 0) {
      return this.jsonResponse(
        404,
        "Not Found",
        { error: `City '${city}' was not found` },
        geocodingResponse.headers
      );
    }

    const resolvedPlace = places[0];
    if (!resolvedPlace || resolvedPlace.name.toLowerCase() !== city.trim().toLowerCase()) {
      return this.jsonResponse(
        200,
        "OK",
        {
          matches: places.map((place) => ({
            name: place.name,
            country: place.country,
            admin1: place.admin1,
            latitude: place.latitude,
            longitude: place.longitude
          }))
        },
        geocodingResponse.headers
      );
    }

    const forecastResponse = await WebHelper.sendAPIRequest(this.createForecastUrl(resolvedPlace), "GET");
    return this.jsonResponse(
      200,
      "OK",
      {
        city: {
          name: resolvedPlace.name,
          country: resolvedPlace.country,
          latitude: resolvedPlace.latitude,
          longitude: resolvedPlace.longitude
        },
        days: this.rankDays(forecastResponse.body)
      },
      forecastResponse.headers
    );
  }

  public getApiBaseUrl(): string {
    return this.forecastApiUrl;
  }

  private createGeocodingUrl(city: string): string {
    const apiUrl = new URL("/v1/search", this.geocodingApiUrl);
    apiUrl.searchParams.set("name", city);
    apiUrl.searchParams.set("count", "10");
    apiUrl.searchParams.set("language", "en");
    apiUrl.searchParams.set("format", "json");
    return apiUrl.toString();
  }

  private createForecastUrl(place: GeocodingPlace): string {
    const apiUrl = new URL("/v1/forecast", this.forecastApiUrl);
    apiUrl.searchParams.set("latitude", String(place.latitude));
    apiUrl.searchParams.set("longitude", String(place.longitude));
    apiUrl.searchParams.set("daily", DAILY_VARIABLES);
    apiUrl.searchParams.set("forecast_days", "7");
    apiUrl.searchParams.set("timezone", place.timezone || "auto");
    return apiUrl.toString();
  }

  private getPlaces(body: unknown): GeocodingPlace[] {
    if (!isRecord(body) || !Array.isArray(body.results)) {
      return [];
    }

    return body.results.flatMap((result) => {
      if (!isRecord(result) || typeof result.name !== "string" || typeof result.latitude !== "number" || typeof result.longitude !== "number") {
        return [];
      }

      return [{
        id: typeof result.id === "number" ? result.id : 0,
        name: result.name,
        latitude: result.latitude,
        longitude: result.longitude,
        country: typeof result.country === "string" ? result.country : undefined,
        admin1: typeof result.admin1 === "string" ? result.admin1 : undefined,
        timezone: typeof result.timezone === "string" ? result.timezone : undefined
      }];
    });
  }

  private rankDays(body: unknown): Array<{ date: string; activities: Array<{ name: string; score: number; reason: string }> }> {
    if (!isRecord(body) || !isRecord(body.daily) || !Array.isArray(body.daily.time)) {
      throw new Error("Open-Meteo forecast response did not include daily data.");
    }

    const daily = body.daily;
    const timeValues = daily.time;
    const dates = Array.isArray(timeValues)
      ? timeValues.filter((value): value is string => typeof value === "string").slice(0, 7)
      : [];
    if (dates.length !== 7) {
      throw new Error(`Expected 7 forecast days from Open-Meteo, received ${dates.length}.`);
    }

    return dates.map((date, index) => {
      const conditions: DailyConditions = {
        weatherCode: numberAt(daily.weather_code, index),
        temperatureMax: numberAt(daily.temperature_2m_max, index),
        temperatureMin: numberAt(daily.temperature_2m_min, index),
        precipitation: numberAt(daily.precipitation_sum, index),
        snowfall: numberAt(daily.snowfall_sum, index),
        windSpeed: numberAt(daily.wind_speed_10m_max, index)
      };

      return {
        date,
        activities: [
          this.rankSkiing(conditions),
          this.rankSurfing(conditions),
          this.rankOutdoorSightseeing(conditions),
          this.rankIndoorSightseeing(conditions)
        ]
      };
    });
  }

  private rankSkiing(conditions: DailyConditions): { name: string; score: number; reason: string } {
    if (conditions.snowfall >= 5) {
      return activity("Skiing", 90, "High snowfall expected");
    }
    if (conditions.snowfall > 0) {
      return activity("Skiing", 70, "Snowfall expected");
    }
    if (conditions.temperatureMax <= 0) {
      return activity("Skiing", 50, "Freezing temperatures without snowfall");
    }
    return activity("Skiing", 10, "No snowfall expected");
  }

  private rankSurfing(conditions: DailyConditions): { name: string; score: number; reason: string } {
    if (conditions.windSpeed >= 12 && conditions.windSpeed <= 35 && conditions.precipitation < 5) {
      return activity("Surfing", 75, "Suitable wave and wind conditions");
    }
    if (conditions.windSpeed > 45) {
      return activity("Surfing", 25, "Wind too strong for surfing");
    }
    return activity("Surfing", 40, "Limited wind for surfing");
  }

  private rankOutdoorSightseeing(conditions: DailyConditions): { name: string; score: number; reason: string } {
    if (conditions.precipitation >= 5) {
      return activity("Outdoor Sightseeing", 25, "Rain expected");
    }
    if (conditions.weatherCode <= 1 && conditions.temperatureMax >= 12 && conditions.temperatureMax <= 28) {
      return activity("Outdoor Sightseeing", 85, `Clear skies and ${Math.round(conditions.temperatureMax)}C`);
    }
    if (conditions.precipitation < 2 && conditions.temperatureMax >= 8 && conditions.temperatureMax <= 30) {
      return activity("Outdoor Sightseeing", 70, "Mild conditions for outdoor sightseeing");
    }
    return activity("Outdoor Sightseeing", 45, "Mixed conditions for outdoor sightseeing");
  }

  private rankIndoorSightseeing(conditions: DailyConditions): { name: string; score: number; reason: string } {
    if (conditions.precipitation >= 5 || conditions.weatherCode >= 51) {
      return activity("Indoor Sightseeing", 80, "Poor outdoor weather favors indoor sightseeing");
    }
    if (conditions.weatherCode <= 1 && conditions.precipitation < 2) {
      return activity("Indoor Sightseeing", 35, "Good weather favors outdoor activities");
    }
    return activity("Indoor Sightseeing", 55, "Indoor sightseeing remains a reasonable option");
  }

  private jsonResponse(
    status: number,
    statusText: string,
    body: unknown,
    headers: Headers
  ): ActivityRankingApiResponse {
    return { status, statusText, body, headers };
  }
}

function activity(name: string, score: number, reason: string): { name: string; score: number; reason: string } {
  return { name, score: Math.max(0, Math.min(100, Math.round(score))), reason };
}

function numberAt(values: unknown, index: number): number {
  if (!Array.isArray(values)) {
    return 0;
  }

  const value = values[index];
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}
