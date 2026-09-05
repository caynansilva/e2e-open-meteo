import { APIScenarariosSharedSteps } from "./APIScenarariosSharedSteps.steps";

export class Sc063ValidateEmptyCityParameterSteps extends APIScenarariosSharedSteps {
    public async THE_CLIENT_SENDS_A_GET_REQUEST_WITH_AN_EMPTY_CITY_PARAMETER(): Promise<void> {
        await this.sendRawRequest("GET", "/activities", { city: "" });
    }
}
