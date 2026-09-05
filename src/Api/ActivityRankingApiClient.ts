import type { CityActivity } from "../Types";
import type { ActivityRankingClient } from "./ActivityRankingClient";
import {
    ActivityRankingApiError,
    ActivityRankingTransportError
} from "./ActivityRankingErrors";

const DEFAULT_BASE_URL = "http://localhost:3000";

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

export class ActivityRankingApiClient implements ActivityRankingClient {
    public readonly baseUrl: string;

    constructor(
        baseUrl = process.env.ACTIVITY_RANKING_API_BASE_URL ||
            DEFAULT_BASE_URL
    ) {
        this.baseUrl = baseUrl.replace(/\/+$/, "");
    }

    public async getActivityRanking(city: string): Promise<CityActivity> {
        return this.request<CityActivity>("GET", "/activities", { city });
    }

    public async searchCities(
        partialName: string,
        limit?: number
    ): Promise<CityActivity[]> {
        return this.request<CityActivity[]>("GET", "/activities", {
            city: partialName,
            limit
        });
    }

    public async sendRequest(
        method: string,
        path: string,
        query?: ActivityRankingQuery
    ): Promise<ActivityRankingHttpResponse> {
        const requestUrl = this.createRequestUrl(path, query);
        const normalizedMethod = method.toUpperCase();
        let response: Response;

        try {
            response = await fetch(requestUrl, { method: normalizedMethod });
        } catch (error: unknown) {
            throw new ActivityRankingTransportError(
                requestUrl.href,
                error,
                normalizedMethod
            );
        }

        return {
            status: response.status,
            statusText: response.statusText,
            headers: response.headers,
            body: await this.getResponseBody(response),
            url: requestUrl.href
        };
    }

    private createRequestUrl(
        path: string,
        query?: ActivityRankingQuery
    ): URL {
        const requestUrl = new URL(path, this.baseUrl);

        for (const [key, value] of Object.entries(query ?? {})) {
            if (value !== undefined) {
                requestUrl.searchParams.set(key, String(value));
            }
        }

        return requestUrl;
    }

    private async request<T>(
        method: string,
        path: string,
        query?: ActivityRankingQuery
    ): Promise<T> {
        const response = await this.sendRequest(method, path, query);

        if (response.status < 200 || response.status >= 300) {
            throw new ActivityRankingApiError({
                status: response.status,
                statusText: response.statusText,
                requestUrl: response.url,
                responseBody: response.body,
                method
            });
        }

        if (typeof response.body === "string") {
            throw new Error(
                this.createFailureMessage(
                    response.url,
                    "invalid JSON response: response body was not JSON"
                )
            );
        }

        return response.body as T;
    }

    private createFailureMessage(
        requestUrl: string,
        detail: string
    ): string {
        return `Activity Ranking API request failed: GET ${requestUrl} ${detail}`;
    }

    private async getResponseBody(response: Response): Promise<unknown | null> {
        try {
            const responseBody = (await response.text()).trim();

            if (!responseBody) {
                return null;
            }

            try {
                return JSON.parse(responseBody) as unknown;
            } catch {
                return responseBody;
            }
        } catch {
            return null;
        }
    }
}
