
import { MockCityActivitiesFactory } from "src/fixtures/MockCityActivitiesFactory";
import { CucumberWorld } from "./Support/CucumberWorld";
import { CityActivity } from "./Types/index";
import { ActivityManager } from "./PageObjects/CityActivities"
import { world as cucumberWorld } from "@cucumber/cucumber";

export class BaseClass {
    public testName: string;
    public mockData: MockCityActivitiesFactory;
    public activityObject: CityActivity;
    public actMgr: ActivityManager;

    constructor() {
        this.mockData = new MockCityActivitiesFactory();
        this.actMgr = new ActivityManager();
    }

    private get world(): CucumberWorld {
        return cucumberWorld as CucumberWorld;
    }

    public logMessage(message): void {
        console.log(message)
    }

    public startTestMessage(): void{
        this.logMessage(`----------------------------------------------`);
        this.logMessage(`Starting tests for Scenario: ${this.testName}.`);
        this.logMessage(`----------------------------------------------`);
    }

    public assert(
        condition: boolean,
        successMessage: string = "Assertion Success!",
        failMessage: string = "Assertion Error!"
    ) {
        condition == true
            ? console.log(successMessage)
            : console.log(failMessage);
    }
}