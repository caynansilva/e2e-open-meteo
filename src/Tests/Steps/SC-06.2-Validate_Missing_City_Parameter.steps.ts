import { APIScenarariosSharedSteps } from "./APIScenarariosSharedSteps.steps";

export class Sc062ValidateMissingCityParameterSteps extends APIScenarariosSharedSteps {
    public async THE_CLIENT_SENDS_A_GET_REQUEST_TO_THE_ACTIVITIES_ENDPOINT_WITHOUT_THE_CITY_PARAMETER(): Promise<void> {
        await this.sendRawRequest("GET", "/activities");
    }
}
