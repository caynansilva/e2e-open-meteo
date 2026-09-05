import {
    CucumberWorld
} from "../../Support/CucumberWorld";
import { Sc06ApiContractSharedSteps } from "./SC-06-API_Contract_Shared.steps";

export class Sc066ValidateUnsupportedHttpMethodSteps extends Sc06ApiContractSharedSteps {
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
            this.httpAssertions.assertMethodNotAllowedResponse(response),
            "Success! The response indicates that the HTTP method is not allowed!",
            "Fail! The response does not indicate that the HTTP method is not allowed!"
        );
    }
}
