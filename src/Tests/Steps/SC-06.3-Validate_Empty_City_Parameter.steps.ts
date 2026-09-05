import {
    CucumberWorld
} from "../../Support/CucumberWorld";
import { Sc06ApiContractSharedSteps } from "./SC-06-API_Contract_Shared.steps";

export class Sc063ValidateEmptyCityParameterSteps extends Sc06ApiContractSharedSteps {
    public async THE_CLIENT_SENDS_A_GET_REQUEST_WITH_AN_EMPTY_CITY_PARAMETER(
        world: CucumberWorld
    ): Promise<void> {
        await this.sendRawRequest(world, "GET", "/activities", {
            city: ""
        });
    }
}
