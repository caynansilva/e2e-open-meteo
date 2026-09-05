import {
    CucumberWorld
} from "../../Support/CucumberWorld";
import { Sc06ApiContractSharedSteps } from "./SC-06-API_Contract_Shared.steps";

export class Sc065ValidateInvalidResultLimitSteps extends Sc06ApiContractSharedSteps {
    public async THE_CLIENT_SEARCHES_FOR_CITIES_USING_AN_INVALID_RESULT_LIMIT(
        world: CucumberWorld
    ): Promise<void> {
        await this.sendRawRequest(world, "GET", "/activities", {
            city: "San",
            limit: 0
        });
    }
}
