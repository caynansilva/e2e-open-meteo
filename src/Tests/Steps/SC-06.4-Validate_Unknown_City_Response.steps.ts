import { APIScenarariosSharedSteps } from "./APIScenarariosSharedSteps.steps";

export class Sc064ValidateUnknownCityResponseSteps extends APIScenarariosSharedSteps {
    public async THE_CLIENT_SENDS_A_GET_REQUEST_FOR_AN_UNKNOWN_CITY(): Promise<void> {
        await this.sendRawRequest("GET", "/activities", { city: "Atlantis" });
    }

    public VALIDATE_THAT_THE_RESPONSE_INDICATES_THAT_THE_CITY_WAS_NOT_FOUND(): void {
        this.assertCityNotFoundResponse("Atlantis");
    }
}
