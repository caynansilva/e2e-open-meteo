import { ActivityManager } from "./PageObjects/CityActivities";
import { ActivityRankingApiClient } from "./Api/ActivityRankingApiClient";
import type { ActivityRankingClient } from "./Types";
import { MockCityActivitiesFactory } from "./fixtures/MockCityActivitiesFactory";

export class BaseClass {
    public readonly mockData = new MockCityActivitiesFactory();
    public readonly actMgr = new ActivityManager();
    public readonly activityRankingClient: ActivityRankingClient =
        ActivityRankingApiClient.create();

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
