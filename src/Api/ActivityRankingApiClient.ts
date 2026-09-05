import type { CityActivity } from "../Types";
import type { ActivityRankingClient } from "./ActivityRankingClient";
import {
    ActivityRankingApiError,
    ActivityRankingTransportError
} from "./ActivityRankingErrors";

const DEFAULT_BASE_URL = "http://localhost:3000";

export class ActivityRankingApiClient implements ActivityRankingClient {
    private readonly activityRankingPath = "/activities";
    public readonly baseUrl: string;

    constructor(
        baseUrl = process.env.ACTIVITY_RANKING_API_BASE_URL ||
            DEFAULT_BASE_URL
    ) {
        this.baseUrl = baseUrl.replace(/\/+$/, "");
    }

    public async getActivityRanking(city: string): Promise<CityActivity> {
        const requestUrl = this.createRequestUrl(city);

        return this.request<CityActivity>(requestUrl);
    }

    public async searchCities(
        partialName: string,
        limit?: number
    ): Promise<CityActivity[]> {
        const requestUrl = this.createRequestUrl(partialName, limit);

        return this.request<CityActivity[]>(requestUrl);
    }

    private createRequestUrl(city: string, limit?: number): URL {
        const requestUrl = new URL(this.activityRankingPath, this.baseUrl);

        requestUrl.searchParams.set("city", city);

        if (limit !== undefined) {
            requestUrl.searchParams.set("limit", String(limit));
        }

        return requestUrl;
    }

    private async request<T>(requestUrl: URL): Promise<T> {
        let response: Response;

        try {
            response = await fetch(requestUrl, { method: "GET" });
        } catch (error: unknown) {
            throw new ActivityRankingTransportError(requestUrl.href, error);
        }

        if (!response.ok) {
            throw new ActivityRankingApiError({
                status: response.status,
                statusText: response.statusText,
                requestUrl: requestUrl.href,
                responseBody: await this.getResponseBody(response)
            });
        }

        try {
            return (await response.json()) as T;
        } catch (error: unknown) {
            throw new Error(
                this.createFailureMessage(
                    requestUrl.href,
                    `invalid JSON response: ${this.getErrorMessage(error)}`
                )
            );
        }
    }

    private createFailureMessage(
        requestUrl: string,
        detail: string
    ): string {
        return `Activity Ranking API request failed: GET ${requestUrl} ${detail}`;
    }

    private async getResponseBody(response: Response): Promise<unknown> {
        try {
            const responseBody = (await response.text()).trim();

            if (!responseBody) {
                return undefined;
            }

            try {
                return JSON.parse(responseBody) as unknown;
            } catch {
                return responseBody;
            }
        } catch {
            return undefined;
        }
    }

    private getErrorMessage(error: unknown): string {
        return error instanceof Error ? error.message : String(error);
    }
}
