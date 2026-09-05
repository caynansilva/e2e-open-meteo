import type { CityActivity } from "../Types";

const DEFAULT_BASE_URL = "http://localhost:3000";

export class ActivityRankingApiClient {
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
            throw new Error(
                this.createFailureMessage(
                    requestUrl,
                    this.getTransportErrorDetail(error)
                )
            );
        }

        if (!response.ok) {
            const responseDetail = await this.getResponseDetail(response);

            throw new Error(
                this.createFailureMessage(
                    requestUrl,
                    `${response.status} ${response.statusText}${responseDetail}`
                )
            );
        }

        try {
            return (await response.json()) as T;
        } catch (error: unknown) {
            throw new Error(
                this.createFailureMessage(
                    requestUrl,
                    `invalid JSON response: ${this.getErrorMessage(error)}`
                )
            );
        }
    }

    private createFailureMessage(
        requestUrl: URL,
        detail: string
    ): string {
        return `Activity Ranking API request failed: GET ${requestUrl.href} ${detail}`;
    }

    private async getResponseDetail(response: Response): Promise<string> {
        try {
            const responseBody = (await response.text()).trim();

            return responseBody ? `: ${responseBody}` : "";
        } catch {
            return "";
        }
    }

    private getTransportErrorDetail(error: unknown): string {
        if (!(error instanceof Error)) {
            return String(error);
        }

        if (error.cause && typeof error.cause === "object") {
            const causeCode = "code" in error.cause ? error.cause.code : undefined;

            if (typeof causeCode === "string") {
                return `${causeCode}: ${error.message}`;
            }
        }

        return this.getErrorMessage(error);
    }

    private getErrorMessage(error: unknown): string {
        return error instanceof Error ? error.message : String(error);
    }
}
