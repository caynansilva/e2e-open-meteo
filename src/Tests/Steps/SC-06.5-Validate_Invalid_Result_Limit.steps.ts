import { APIScenarariosSharedSteps } from "./APIScenarariosSharedSteps.steps";

export class Sc065ValidateInvalidResultLimitSteps extends APIScenarariosSharedSteps {
    public async THE_CLIENT_SEARCHES_FOR_CITIES_USING_AN_INVALID_RESULT_LIMIT(): Promise<void> {
        await this.sendRawRequest("GET", "/activities", { city: "San", limit: 0 });
    }
}
