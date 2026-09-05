import {
    CucumberWorld
} from "../../Support/CucumberWorld";
import { APIScenarariosSharedSteps } from "./APIScenarariosSharedSteps.steps";

export class Sc066ValidateUnsupportedHttpMethodSteps extends APIScenarariosSharedSteps {
    public async THE_CLIENT_SENDS_A_POST_REQUEST_TO_THE_ACTIVITIES_ENDPOINT(
        world: CucumberWorld
    ): Promise<void> {
        await this.sendRawRequest(world, "POST", "/activities");
    }

    public VALIDATE_THAT_THE_RESPONSE_INDICATES_THAT_THE_HTTP_METHOD_IS_NOT_ALLOWED(
        world: CucumberWorld
    ): void {
        const response = this.getHttpResponse(world);

        this.assert(
            this.apiClient.assertMethodNotAllowedResponse(response),
            "Success! The response indicates that the HTTP method is not allowed!",
            "Fail! The response does not indicate that the HTTP method is not allowed!"
        );
    }
}
