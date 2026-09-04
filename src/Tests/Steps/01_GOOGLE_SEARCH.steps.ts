import { world as cucumberWorld } from "@cucumber/cucumber";
import { expect } from "@playwright/test";
import { GooglePage } from "../../PageObjects/Sample/GooglePage";
import { CucumberWorld } from "../../Support/CucumberWorld";
import { WebHelper } from "../../Utils/WebHelper";

export class STEP {
  private get world(): CucumberWorld {
    return cucumberWorld as CucumberWorld;
  }

  public async NAVIGATE_TO_GOOGLE(): Promise<void> {
    await this.world.getPageObject(GooglePage).navigateToGoogle();
  }

  public async SEARCH_FOR_RANDOM_TERM(): Promise<void> {
    const googlePage = this.world.getPageObject(GooglePage);
    const searchTerm = `playwright-${WebHelper.getRandomStringLetterOnly(8)}`;

    await googlePage.typeTextOnSearchInput(searchTerm);
    await googlePage.clickSearchButton();
  }

  public async VERIFY_GOOGLE_HOME_PAGE_DISPLAYED(): Promise<void> {
    await expect(this.world.requirePage()).toHaveURL(/^https:\/\/(www\.)?google\.[^/]+\/?$/);
    await this.world.getPageObject(GooglePage).logoImage.shouldBeVisible();
  }

  public async VERIFY_GOOGLE_HOME_PAGE_ELEMENTS_DISPLAYED(): Promise<void> {
    const googlePage = this.world.getPageObject(GooglePage);

    await googlePage.logoImage.shouldBeVisible();
    await googlePage.searchInput.shouldBeVisible();
    await googlePage.searchButton.shouldBeVisible();
  }

  public async VERIFY_GOOGLE_SEARCH_RESULTS_DISPLAYED(): Promise<void> {
    await expect(this.world.requirePage()).not.toHaveURL(/^https:\/\/(www\.)?google\.[^/]+\/?$/);
  }
}
