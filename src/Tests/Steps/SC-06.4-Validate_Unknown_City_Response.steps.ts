import {
    CucumberWorld
} from "../../Support/CucumberWorld";
import { Sc06ApiContractSharedSteps } from "./SC-06-API_Contract_Shared.steps";

export class Sc064ValidateUnknownCityResponseSteps extends Sc06ApiContractSharedSteps {
    public async THE_CLIENT_SENDS_A_GET_REQUEST_FOR_AN_UNKNOWN_CITY(
        world: CucumberWorld
    ): Promise<void> {
        await this.sendRawRequest(world, "GET", "/activities", {
            city: "Atlantis"
        });
    }

    public VALIDATE_THAT_THE_RESPONSE_INDICATES_THAT_THE_CITY_WAS_NOT_FOUND(
        world: CucumberWorld
    ): void {
        this.assertCityNotFoundResponse(world, "Atlantis");
    }
}
