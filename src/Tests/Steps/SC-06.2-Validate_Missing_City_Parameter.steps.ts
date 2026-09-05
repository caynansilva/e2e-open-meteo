import {
    CucumberWorld
} from "../../Support/CucumberWorld";
import { Sc06ApiContractSharedSteps } from "./SC-06-API_Contract_Shared.steps";

export class Sc062ValidateMissingCityParameterSteps extends Sc06ApiContractSharedSteps {
    public async THE_CLIENT_SENDS_A_GET_REQUEST_TO_THE_ACTIVITIES_ENDPOINT_WITHOUT_THE_CITY_PARAMETER(
        world: CucumberWorld
    ): Promise<void> {
        await this.sendRawRequest(world, "GET", "/activities");
    }
}
