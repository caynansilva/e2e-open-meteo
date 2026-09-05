import {
    ActivityRankingApiClient,
    type ActivityRankingHttpResponse
} from "../../Api/ActivityRankingApiClient";
import { ActivityRankingHttpAssertions } from "../../Api/ActivityRankingHttpAssertions";
import { BaseClass } from "../../BaseClass";
import {
    CucumberWorld,
    WORLD_DATA_KEYS
} from "../../Support/CucumberWorld";
import type { CityNotFoundError } from "../../Types";

export class Sc06ApiContractSharedSteps extends BaseClass {
    protected readonly apiClient = new ActivityRankingApiClient();
    protected readonly httpAssertions = new ActivityRankingHttpAssertions();

    public THE_ACTIVITY_RANKING_API_ENDPOINT_IS_AVAILABLE(
        _world: CucumberWorld
    ): void {
        this.assert(
            this.apiClient.baseUrl.length > 0,
            "Success! The Activity Ranking API base URL is configured!",
            "Fail! The Activity Ranking API base URL is not configured!"
        );
    }

    public THE_ACTIVITY_RANKING_API_IS_AVAILABLE(
        _world: CucumberWorld
    ): void {
        this.THE_ACTIVITY_RANKING_API_ENDPOINT_IS_AVAILABLE(_world);
    }

    public VALIDATE_THAT_THE_RESPONSE_STATUS_IS_INT(
        world: CucumberWorld,
        expectedStatus: number
    ): void {
        const response = this.getHttpResponse(world);

        this.assert(
            this.httpAssertions.assertStatusCode(response, expectedStatus),
            `Success! The response status is ${expectedStatus}!`,
            `Fail! Expected response status ${expectedStatus}, received ${response.status}!`
        );
    }

    public VALIDATE_THAT_THE_RESPONSE_CONTAINS_A_CLEAR_CLIENT_ERROR(
        world: CucumberWorld
    ): void {
        const response = this.getHttpResponse(world);

        this.assert(
            this.httpAssertions.assertClientErrorResponse(response),
            "Success! The response contains a clear client error!",
            "Fail! The response does not contain a clear client error!"
        );
    }

    protected async sendRawRequest(
        world: CucumberWorld,
        method: string,
        path: string,
        query?: Record<string, string | number | undefined>
    ): Promise<void> {
        const response = await this.apiClient.sendRequest(method, path, query);

        world.setData(WORLD_DATA_KEYS.httpResponse, response);
    }

    protected getHttpResponse(world: CucumberWorld): ActivityRankingHttpResponse {
        return this.getRequiredData<ActivityRankingHttpResponse>(
            world,
            WORLD_DATA_KEYS.httpResponse
        );
    }

    protected assertCityNotFoundResponse(
        world: CucumberWorld,
        city: string
    ): void {
        const response = this.getHttpResponse(world);
        const errorResponse = response.body as CityNotFoundError;
        const activityManager = this.createActivityManager();

        this.assert(
            activityManager.assertCityNotFoundError(errorResponse, city),
            `Success! The response indicates that "${city}" was not found!`,
            `Fail! The response does not indicate that "${city}" was not found!`
        );
    }
}
