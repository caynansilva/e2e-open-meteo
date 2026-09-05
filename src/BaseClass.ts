import { ActivityManager } from "./PageObjects/CityActivities";
import { CucumberWorld } from "./Support/CucumberWorld";
import { ActivityRankingApiClient } from "./Api/ActivityRankingApiClient";
import type { ActivityRankingClient } from "./Types";
import { MockCityActivitiesFactory } from "./fixtures/MockCityActivitiesFactory";

export class BaseClass {
    public readonly mockData = new MockCityActivitiesFactory();
    public readonly activityRankingClient: ActivityRankingClient =
        ActivityRankingApiClient.create();

    protected createActivityManager(): ActivityManager {
        return new ActivityManager();
    }

    protected getRequiredData<T>(world: CucumberWorld, key: string): T {
        const value = world.getData<T>(key);

        if (value === undefined) {
            throw new Error(`Scenario data "${key}" is not available.`);
        }

        return value;
    }

    public assert(
        condition: boolean,
        successMessage: string = "Assertion Success!",
        failMessage: string = "Assertion Error!"
    ): void {
        if (condition) {
            console.log(successMessage);
            return;
        }

        console.log(failMessage);
        throw new Error(failMessage);
    }
}
