import { ActivityRankingApiClient } from "../../Api/ActivityRankingApiClient";
import { BaseClass } from "../../BaseClass";
import type {
    ActivityRankingHttpResponse,
    ActivityRankingQuery,
    CityNotFoundError
} from "../../Types";

export class APIScenarariosSharedSteps extends BaseClass {
    protected readonly apiClient = new ActivityRankingApiClient();
    protected static httpResponse: ActivityRankingHttpResponse | undefined;

    public async THE_ACTIVITY_RANKING_API_ENDPOINT_IS_AVAILABLE(): Promise<void> {
        const isAvailable = await this.apiClient.isApiEndpointAvailable();
        this.assert(
            isAvailable,
            "Success! The Activity Ranking API base URL is configured!",
            "Fail! The Activity Ranking API base URL is not configured!"
        );
    }

    public async THE_ACTIVITY_RANKING_API_IS_AVAILABLE(): Promise<void> {
        await this.THE_ACTIVITY_RANKING_API_ENDPOINT_IS_AVAILABLE();
    }

    public VALIDATE_THAT_THE_RESPONSE_STATUS_IS_INT(expectedStatus: number): void {
        const response = this.getHttpResponse();
        this.assert(
            this.apiClient.assertStatusCode(response, expectedStatus),
            `Success! The response status is ${expectedStatus}!`,
            `Fail! Expected response status ${expectedStatus}, received ${response.status}!`
        );
    }

    public VALIDATE_THAT_THE_RESPONSE_CONTAINS_A_CLEAR_CLIENT_ERROR(): void {
        const response = this.getHttpResponse();
        this.assert(
            this.apiClient.assertClientErrorResponse(response),
            "Success! The response contains a clear client error!",
            "Fail! The response does not contain a clear client error!"
        );
    }

    protected async sendRawRequest(
        method: string,
        path: string,
        query?: ActivityRankingQuery
    ): Promise<void> {
        APIScenarariosSharedSteps.httpResponse = await this.apiClient.sendRequest(
            method,
            path,
            query
        );
    }

    protected getHttpResponse(): ActivityRankingHttpResponse {
        const response = APIScenarariosSharedSteps.httpResponse;

        if (!response) {
            throw new Error("The HTTP response is not available.");
        }

        return response;
    }

    protected assertCityNotFoundResponse(city: string): void {
        const errorResponse = this.getHttpResponse().body as CityNotFoundError;
        this.assert(
            this.actMgr.assertCityNotFoundError(errorResponse, city),
            `Success! The response indicates that "${city}" was not found!`,
            `Fail! The response does not indicate that "${city}" was not found!`
        );
    }
}
