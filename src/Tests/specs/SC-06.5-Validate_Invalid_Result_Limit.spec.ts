// Native Cucumber bindings generated from: Activity Ranking API endpoint and response contract
import { When } from "@cucumber/cucumber";
import type { CucumberWorld } from "../../Support/CucumberWorld";
import { Sc065ValidateInvalidResultLimitSteps } from "../Steps/SC-06.5-Validate_Invalid_Result_Limit.steps";
import "./SC-06-API_Contract_Shared.spec";

const steps = new Sc065ValidateInvalidResultLimitSteps();

When(
    "the client searches for cities using an invalid result limit",
    async function (this: CucumberWorld) {
        await steps.THE_CLIENT_SEARCHES_FOR_CITIES_USING_AN_INVALID_RESULT_LIMIT(this);
    }
);
