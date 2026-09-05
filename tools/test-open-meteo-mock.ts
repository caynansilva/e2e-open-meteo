import assert from "node:assert/strict";
import { OpenMeteoMockServer } from "../src/Mocks/OpenMeteo/OpenMeteoMockServer";
import type {
    OpenMeteoForecastResponse,
    OpenMeteoSearchResponse
} from "../src/Mocks/OpenMeteo/OpenMeteoTypes";

const FORBIDDEN_ACTIVITY_FIELDS = [
    "activityName",
    "activitySuitability",
    "activityReason",
    "rankings",
    "Skiing",
    "Surfing",
    "Indoor Sightseeing",
    "Outdoor Sightseeing"
];

async function getJson<T>(requestUrl: string): Promise<T> {
    const response = await fetch(requestUrl);

    assert.equal(response.ok, true);
    return (await response.json()) as T;
}

async function verifyMockServer(): Promise<void> {
    const mockServer = new OpenMeteoMockServer({ port: 0 });

    await mockServer.start();

    try {
        await verifySearchResponses(mockServer.baseUrl);
        await verifyForecastResponse(mockServer.baseUrl);
        verifyRecordedRequests(mockServer);
        console.log("Open-Meteo mock verification passed.");
    } finally {
        await mockServer.stop();
    }
}

async function verifySearchResponses(baseUrl: string): Promise<void> {
    const exactResponse = await getJson<OpenMeteoSearchResponse>(
        `${baseUrl}/v1/search?name=London&count=1`
    );
    assert.equal(exactResponse.results.length, 1);
    assert.equal(exactResponse.results[0]?.name, "London");
    verifyPayloadBoundary(exactResponse);

    const partialResponse = await getJson<OpenMeteoSearchResponse>(
        `${baseUrl}/v1/search?name=San`
    );
    assert.ok(partialResponse.results.length > 1);
    verifyPayloadBoundary(partialResponse);

    const limitedResponse = await getJson<OpenMeteoSearchResponse>(
        `${baseUrl}/v1/search?name=San&count=2`
    );
    assert.equal(limitedResponse.results.length, 2);
    verifyPayloadBoundary(limitedResponse);

    const invalidResponse = await getJson<OpenMeteoSearchResponse>(
        `${baseUrl}/v1/search?name=Atlantis`
    );
    assert.deepEqual(invalidResponse.results, []);
    verifyPayloadBoundary(invalidResponse);
}

async function verifyForecastResponse(baseUrl: string): Promise<void> {
    const forecastResponse = await getJson<OpenMeteoForecastResponse>(
        `${baseUrl}/v1/forecast?latitude=51.5085&longitude=-0.1257&` +
        "start_date=2026-09-06&daily=temperature_2m_max"
    );
    const { daily } = forecastResponse;

    assert.equal(daily.time.length, 7);
    assert.equal(daily.temperature_2m_max.length, 7);
    assert.equal(daily.temperature_2m_min.length, 7);
    assert.equal(daily.precipitation_sum.length, 7);
    assert.equal(daily.snowfall_sum.length, 7);
    assert.equal(daily.wind_speed_10m_max.length, 7);
    assert.equal(daily.weather_code.length, 7);
    assert.deepEqual(daily.time, createExpectedDates("2026-09-06"));
    verifyPayloadBoundary(forecastResponse);
}

function verifyRecordedRequests(mockServer: OpenMeteoMockServer): void {
    const requests = mockServer.getRequests();

    assert.equal(requests.length, 5);
    assert.equal(requests[0]?.path, "/v1/search");
    assert.equal(requests[2]?.query.count, "2");
    assert.equal(requests[4]?.path, "/v1/forecast");
    assert.equal(requests[4]?.query.latitude, "51.5085");

    mockServer.resetRequests();
    assert.deepEqual(mockServer.getRequests(), []);
}

function verifyPayloadBoundary(payload: unknown): void {
    const serializedPayload = JSON.stringify(payload);

    for (const forbiddenField of FORBIDDEN_ACTIVITY_FIELDS) {
        assert.equal(serializedPayload.includes(forbiddenField), false);
    }
}

function createExpectedDates(startDate: string): string[] {
    const firstDate = new Date(`${startDate}T00:00:00.000Z`);

    return Array.from({ length: 7 }, (_, index) => {
        const date = new Date(firstDate);
        date.setUTCDate(date.getUTCDate() + index);
        return date.toISOString().slice(0, 10);
    });
}

void verifyMockServer().catch((error: unknown) => {
    console.error(error);
    process.exitCode = 1;
});
