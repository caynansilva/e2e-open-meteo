import {
    CucumberWorld
} from "../../Support/CucumberWorld";
import { Sc06ApiContractSharedSteps } from "./SC-06-API_Contract_Shared.steps";

export class Sc061ValidateSuccessfulActivityRequestSteps extends Sc06ApiContractSharedSteps {
    public async THE_CLIENT_SENDS_A_GET_REQUEST_FOR_ACTIVITIES_USING_A_VALID_CITY(
        world: CucumberWorld
    ): Promise<void> {
        await this.sendRawRequest(world, "GET", "/activities", {
            city: "London"
        });
    }

    public VALIDATE_THAT_THE_RESPONSE_CONTENT_TYPE_IS_JSON(
        world: CucumberWorld
    ): void {
        const response = this.getHttpResponse(world);

        this.assert(
            this.httpAssertions.assertJsonContentType(response),
            "Success! The response content type is JSON!",
            "Fail! The response content type is not JSON!"
        );
    }
}
