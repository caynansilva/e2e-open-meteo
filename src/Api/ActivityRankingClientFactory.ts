import type { ActivityRankingClient } from "./ActivityRankingClient";
import { ActivityRankingApiClient } from "./ActivityRankingApiClient";
import { FixtureActivityRankingClient } from "./FixtureActivityRankingClient";

const TARGET_ENVIRONMENT_VARIABLE = "ACTIVITY_RANKING_TEST_TARGET";

export function createActivityRankingClient(): ActivityRankingClient {
    const target = process.env[TARGET_ENVIRONMENT_VARIABLE];

    if (target === "fixture") {
        return new FixtureActivityRankingClient();
    }

    if (target === "sut") {
        return new ActivityRankingApiClient();
    }

    const receivedTarget = target ?? "<unset>";

    throw new Error(
        `${TARGET_ENVIRONMENT_VARIABLE} must be set to "fixture" or "sut". ` +
        `Received: ${receivedTarget}.`
    );
}
