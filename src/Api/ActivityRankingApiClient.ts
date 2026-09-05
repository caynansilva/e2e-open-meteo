import type {
    ActivityRankingClient,
    ActivityRankingErrorBody,
    ActivityRankingHttpResponse,
    ActivityRankingQuery,
    CityActivity
} from "../Types";
import { FixtureActivityRankingClient } from "../fixtures/FixtureActivityRankingClient";

const DEFAULT_BASE_URL = "http://localhost:3000";
const TARGET_ENVIRONMENT_VARIABLE = "ACTIVITY_RANKING_TEST_TARGET";

export class ActivityRankingApiClient implements ActivityRankingClient {
    public readonly baseUrl: string;

    constructor(
        baseUrl = process.env.ACTIVITY_RANKING_API_BASE_URL ||
            DEFAULT_BASE_URL
    ) {
        this.baseUrl = baseUrl.replace(/\/+$/, "");
    }

    public static create(): ActivityRankingClient {
        const target = process.env[TARGET_ENVIRONMENT_VARIABLE];

        if (target === "fixture") {
            return new FixtureActivityRankingClient();
        }

        if (target === "sut") {
            return new ActivityRankingApiClient();
        }

        const receivedTarget = target ?? "<unset>";

        throw new Error(
            `${TARGET_ENVIRONMENT_VARIABLE} must be set to "fixture" or "sut". ` +
            `Received: ${receivedTarget}.`
        );
    }

    public async isApiEndpointAvailable(): Promise<boolean> {
        try {
            const response = await fetch(this.baseUrl, {
                method: "GET"
            });

            return response.ok;
        } catch {
            return false;
        }
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
        const response = await fetch(requestUrl, { method: normalizedMethod });

        return {
            status: response.status,
            statusText: response.statusText,
            headers: response.headers,
            body: await this.getResponseBody(response),
            url: requestUrl.href
        };
    }

    public assertStatusCode(
        response: ActivityRankingHttpResponse,
        expectedStatus: number
    ): boolean {
        return response.status === expectedStatus;
    }

    public assertJsonContentType(
        response: ActivityRankingHttpResponse
    ): boolean {
        return response.headers
            .get("content-type")
            ?.toLowerCase()
            .includes("application/json") ?? false;
    }

    public assertClientErrorResponse(
        response: ActivityRankingHttpResponse
    ): boolean {
        return this.getErrorText(response.body).length > 0;
    }

    public assertMethodNotAllowedResponse(
        response: ActivityRankingHttpResponse
    ): boolean {
        const errorText = this.getErrorText(response.body).toLowerCase();

        return errorText.includes("method") &&
            errorText.includes("not allowed");
    }

    public assertEndpointNotFoundResponse(
        response: ActivityRankingHttpResponse
    ): boolean {
        const errorText = this.getErrorText(response.body).toLowerCase();

        return (errorText.includes("endpoint") || errorText.includes("route")) &&
            errorText.includes("not found");
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
            const statusDetail = `${response.status} ${response.statusText}`.trim();
            const responseBody = response.body === undefined
                ? ""
                : `: ${typeof response.body === "string"
                    ? response.body
                    : JSON.stringify(response.body)}`;

            throw new Error(
                this.createFailureMessage(
                    response.url,
                    `${statusDetail}${responseBody}`,
                    method
                ),
                { cause: response.body }
            );
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
        detail: string,
        method = "GET"
    ): string {
        return `Activity Ranking API request failed: ${method.toUpperCase()} ${requestUrl} ${detail}`;
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

    private getErrorText(body: unknown): string {
        if (typeof body === "string") {
            return body.trim();
        }

        if (this.isErrorObject(body)) {
            return body.error ?? body.message ?? "";
        }

        return "";
    }

    private isErrorObject(body: unknown): body is ActivityRankingErrorBody {
        return typeof body === "object" && body !== null;
    }
}
