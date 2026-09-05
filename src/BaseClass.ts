import { MockCityActivitiesFactory } from "src/fixtures/MockCityActivitiesFactory";
import { CityActivity } from "./Types/index";
import { ActivityManager } from "./PageObjects/CityActivities"

export class BaseClass {
    public testName: string;
    public mockData: MockCityActivitiesFactory;
    public activityObject: CityActivity;
    public actMgr: ActivityManager;

    constructor() {
        this.mockData = new MockCityActivitiesFactory();
        this.actMgr = new ActivityManager();
    }

    public logMessage(message: string): void {
        console.log(message);
    }

    public startTestMessage(): void {
        this.logMessage(`----------------------------------------------`);
        this.logMessage(`Starting tests for Scenario: ${this.testName}.`);
        this.logMessage(`----------------------------------------------`);
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
