import {
    CucumberWorld
} from "../../Support/CucumberWorld";
import { Sc06ApiContractSharedSteps } from "./SC-06-API_Contract_Shared.steps";

export class Sc067ValidateUnknownEndpointSteps extends Sc06ApiContractSharedSteps {
    public async THE_CLIENT_SENDS_A_GET_REQUEST_TO_AN_UNSUPPORTED_ENDPOINT(
        world: CucumberWorld
    ): Promise<void> {
        await this.sendRawRequest(world, "GET", "/unsupported");
    }

    public VALIDATE_THAT_THE_RESPONSE_INDICATES_THAT_THE_ENDPOINT_WAS_NOT_FOUND(
        world: CucumberWorld
    ): void {
        const response = this.getHttpResponse(world);

        this.assert(
            this.httpAssertions.assertEndpointNotFoundResponse(response),
            "Success! The response indicates that the endpoint was not found!",
            "Fail! The response does not indicate that the endpoint was not found!"
        );
    }
}
