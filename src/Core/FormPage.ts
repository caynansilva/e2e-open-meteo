import { Page } from "@playwright/test";
import { WebElement } from "./WebElement";

export class FormPage {
  protected readonly page: Page;
  public formElementsList: WebElement[] = [];

  constructor(page: Page) {
    this.page = page;
    this.setPageObjects();
    this.initializeCommonElements();
  }

  protected setPageObjects(): void {
    // Subclasses define form-specific elements.
  }

  protected initializeCommonElements(): void {
    // Subclasses add shared dialog controls when needed.
  }

  public async assertAllFormElementsPresence(): Promise<void> {
    for (const element of this.formElementsList) {
      await element.shouldBeVisible();
    }
  }
}
