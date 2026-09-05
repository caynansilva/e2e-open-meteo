import { APIScenarariosSharedSteps } from "./APIScenarariosSharedSteps.steps";

export class Sc061ValidateSuccessfulActivityRequestSteps extends APIScenarariosSharedSteps {
    public async THE_CLIENT_SENDS_A_GET_REQUEST_FOR_ACTIVITIES_USING_A_VALID_CITY(): Promise<void> {
        await this.sendRawRequest("GET", "/activities", { city: "London" });
    }

    public VALIDATE_THAT_THE_RESPONSE_CONTENT_TYPE_IS_JSON(): void {
        const response = this.getHttpResponse();
        this.assert(
            this.apiClient.assertJsonContentType(response),
            "Success! The response content type is JSON!",
            "Fail! The response content type is not JSON!"
        );
    }
}
