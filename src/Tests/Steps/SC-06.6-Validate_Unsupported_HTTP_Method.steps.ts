import { APIScenarariosSharedSteps } from "./APIScenarariosSharedSteps.steps";

export class Sc066ValidateUnsupportedHttpMethodSteps extends APIScenarariosSharedSteps {
    public async THE_CLIENT_SENDS_A_POST_REQUEST_TO_THE_ACTIVITIES_ENDPOINT(): Promise<void> {
        await this.sendRawRequest("POST", "/activities");
    }

    public VALIDATE_THAT_THE_RESPONSE_INDICATES_THAT_THE_HTTP_METHOD_IS_NOT_ALLOWED(): void {
        const response = this.getHttpResponse();
        this.assert(
            this.apiClient.assertMethodNotAllowedResponse(response),
            "Success! The response indicates that the HTTP method is not allowed!",
            "Fail! The response does not indicate that the HTTP method is not allowed!"
        );
    }
}
