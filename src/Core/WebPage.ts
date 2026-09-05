import { Page } from "@playwright/test";
import { CardData, IWebElementProperties } from "../Types";
import { Environment } from "../Utils/Environment";
import { WebHelper } from "../Utils/WebHelper";
import { WebElement } from "./WebElement";

/**
 * WebPage - Base page object class for Playwright
 * 
 * This class provides common functionality for all page objects:
 * - Element assertion lists for batch validations
 * - Common page sections (hero, search, filters, cards, etc.)
 * - Navigation and interaction methods
 * 
 * Extend this class to create specific page objects for your application.
 */
export class WebPage {
  /**
   * Protected Page Variables
   */
  protected LOG_DEV_INFO: boolean = true;
  protected LOG_MESSAGES: boolean = true;
  protected LOG_MESSAGES_PREFIX: string = "[PAGE]: ";
  protected page: Page;

  protected _pageUrl: string;
  protected envVariables = Environment;
  protected webHelper = WebHelper;

  /**
   * Public Elements Lists for batch assertions
   */
  public elementsAssertionList: WebElement[] = [];
  public hiddenElementsAssertionList: WebElement[] = [];
  public removedElementsAssertionList: WebElement[] = [];

  /**
   * Public Page Elements - Common UI elements
   */
  public pageTitle: WebElement;
  public _pageTitleText: string;

  // Header Section Elements
  public pageHeaderTitle: WebElement;
  public pageHeaderDescription: WebElement;

  constructor(page: Page) {
    this.page = page;
    this.setPageObjects();
    this.setElementsAssertionList();
  }

  /**
   * Override this method in subclasses to define page-specific elements
   */
  protected setPageObjects(): void {
    // Base implementation - override in subclasses
  }

  /**
   * Navigate to the page from the default screen
   */
  public goToFromDefaultScreen(): Promise<void> | void {
    return this.pageTitle.runWhenElementPresenceIs(false, () => {
      return Promise.resolve();
    });
  }

  /**
   * Navigate to the default screen
   */
  public goToDefaultScreen(): Promise<void> | void {
    return this.pageTitle.runWhenElementPresenceIs(true, () => {
      return Promise.resolve();
    });
  }

  /**
   * Assert the title text of the page
   */
  public assertTitleText(): Promise<void> | void {
    return this.pageTitle.shouldHaveText(this._pageTitleText);
  }

  /**
   * Override this method in subclasses to set elements for assertion
   */
  public setElementsAssertionList(): void {
    this.elementsAssertionList = [];
  }

  /**
   * Assert all elements presence inside the elementsAssertionList
   */
  public async assertAllElementsPresence(
    elementIndex: number = 0
  ): Promise<void> {
    if (!this.page || this.page.isClosed()) {
      throw new Error(
        "Page is closed or invalid, cannot proceed with presence assertions"
      );
    }

    this.webHelper.logInfo(
      `🔍 Asserting presence of ${this.elementsAssertionList.length} elements...`
    );

    try {
      for (const element of this.elementsAssertionList) {
        try {
          this.webHelper.logInfo("Asserting Presence of: " + element.identifier);
          await element.shouldBeVisible(elementIndex);
          await this.page.waitForTimeout(100);
        } catch (error) {
          this.webHelper.logError(
            `❌ - Failed to assert presence of ${element.identifier}: ${error}`
          );
          throw error;
        }
      }

      this.webHelper.logSuccess("✅ All element presence assertions completed");
    } catch (error) {
      this.webHelper.logError(`❌ - Error asserting element presence: ${error}`);
      throw error;
    }
  }

  /**
   * Assert all elements internal text inside the elementsAssertionList
   */
  public async assertAllElementsInternalText(
    elementIndex: number = 0
  ): Promise<void> {
    if (!this.page || this.page.isClosed()) {
      throw new Error(
        "Page is closed or invalid, cannot proceed with text assertions"
      );
    }

    const elementsWithText = this.elementsAssertionList.filter(
      element => element._internalText && element._internalText !== ""
    );

    this.webHelper.logInfo(
      `📝 Asserting text content for ${elementsWithText.length} elements...`
    );

    try {
      for (const element of elementsWithText) {
        try {
          await element.assertInternalText(elementIndex);
          await this.page.waitForTimeout(100);
        } catch (error) {
          this.webHelper.logError(
            `❌ - Failed to assert text content for ${element.identifier}: ${error}`
          );
          throw error;
        }
      }

      this.webHelper.logSuccess("✅ All text content assertions completed");
    } catch (error) {
      this.webHelper.logError(`❌ - Error asserting text content: ${error}`);
      throw error;
    }
  }

  /**
   * Navigate to the URL of the page
   */
  public async navigateToUrl(): Promise<void> {
    const url = this._pageUrl;
    await this.webHelper.navigateToUrl(this.page, url);
  }

  /**
   * Assert all hidden elements absence
   */
  public async assertHiddenElementsAbsence(
    elementIndex: number = 0
  ): Promise<void> {
    this.webHelper.logInfo(
      `🔍 Asserting absence of ${this.hiddenElementsAssertionList.length} hidden elements ...`
    );

    try {
      for (const element of this.hiddenElementsAssertionList) {
        try {
          this.webHelper.logInfo("Asserting absence of: " + element.identifier);
          await element.shouldNotBeVisible(elementIndex);
          await this.page.waitForTimeout(100);
        } catch (error) {
          this.webHelper.logError(
            `❌ - Failed to assert absence of ${element.identifier}: ${error}`
          );
          throw error;
        }
      }

      this.webHelper.logSuccess("✅ All element absence assertions completed!");
    } catch (error) {
      this.webHelper.logError(`❌ - Error asserting element absence: ${error}`);
      throw error;
    }
  }

  /**
   * Update the page objects
   */
  public updatePageSettings(): void {
    this.setPageObjects();
  }

  /**
   * Assert all elements internal text in a provided list
   */
  public async assertElementsListInternalText(
    elementsList: WebElement[]
  ): Promise<void> {
    try {
      const elementsWithText = elementsList.filter(
        element => element._internalText && element._internalText !== ""
      );

      this.webHelper.logInfo(
        `📝 Asserting text content for ${elementsWithText.length} elements...`
      );

      for (const element of elementsWithText) {
        try {
          await element.assertInternalText();
          await this.page.waitForTimeout(100);
        } catch (error) {
          this.webHelper.logError(
            `❌ - Failed to assert text content for ${element.identifier}: ${error}`
          );
          throw error;
        }
      }

      this.webHelper.logSuccess("✅ All text content assertions completed");
    } catch (error) {
      this.webHelper.throwError("⚠️ - Error asserting elements text:" + error);
      throw error;
    }
  }

  /**
   * Assert all elements presence in a provided list
   */
  public async assertElementsListPresence(
    elementsList: WebElement[]
  ): Promise<void> {
    try {
      this.webHelper.logInfo(
        `🔍 Asserting presence of ${elementsList.length} elements...`
      );

      for (const element of elementsList) {
        try {
          this.webHelper.logInfo(
            "🔎 - Asserting Presence of: " + element.identifier
          );
          await element.shouldBeVisible();
          await this.page.waitForTimeout(100);
        } catch (error) {
          this.webHelper.logError(
            `❌ - Failed to assert presence of ${element.identifier}: ${error}`
          );
          throw error;
        }
      }

      this.webHelper.logSuccess("✅ All element presence assertions completed");
    } catch (error) {
      this.webHelper.throwError(
        "⚠️ - Error asserting elements presence:" + error
      );
      throw error;
    }
  }

  /**
   * Get a random item from a list
   */
  public getRandomItemFromList(list: any[]): any {
    return list[Math.floor(Math.random() * list.length)];
  }

  /**
   * Log a debug message
   */
  protected logDebugMessage(MESSAGE_TEXT: string): void {
    if (this.LOG_DEV_INFO === true) {
      this.webHelper.logInfo(
        this.LOG_MESSAGES_PREFIX + "⚠️ DEBUG: " + MESSAGE_TEXT,
        "INFO"
      );
    }
  }

  public logMessage(MESSAGE_TEXT: string): void {
    if (this.LOG_DEV_INFO === true) {
      this.webHelper.logInfo(this.LOG_MESSAGES_PREFIX + MESSAGE_TEXT);
    }
  }

  /**
   * Assert all elements presence by quantity
   */
  public async assertElementsListPresenceByQuantity(
    elementsList: WebElement[]
  ): Promise<void> {
    this.webHelper.logInfo(
      `🔍 Asserting presence of ${elementsList.length} elements...`
    );
    this.page.waitForTimeout(1);
    for (const element of elementsList) {
      this.webHelper.logInfo(
        "🔎 - Asserting Presence of: " + element.identifier
      );
      const elementQty = await element.getElementsQuantity();
      if (elementQty === 0) {
        this.webHelper.logError("Element not found: " + element.identifier);
        throw new Error("Element not found: " + element.identifier);
      }
      this.webHelper.logInfo("✅ - Element found: " + element.identifier);
    }
  }

  /**
   * Assert all elements internal class properties
   */
  public async assertElementsInternalClassProperties(): Promise<void> {
    if (!this.page || this.page.isClosed()) {
      throw new Error(
        "Page is closed or invalid, cannot proceed with property assertions"
      );
    }

    await this.assertElementsInternalPropertyValues(
      this.elementsAssertionList,
      "class"
    );
  }

  /**
   * Assert all elements internal property values
   */
  public async assertElementsInternalPropertyValues(
    elementsList: WebElement[],
    property: string
  ): Promise<void> {
    this.webHelper.logInfo(
      `🔍 Asserting ${property} properties for ${elementsList.length} elements...`
    );

    try {
      for (const element of elementsList) {
        const elementProperties: IWebElementProperties[] =
          element.propertiesList || [];
        if (elementProperties.length > 0) {
          for (const internalProperty of elementProperties) {
            if (internalProperty.propertyName === property) {
              const propertyValues: string[] =
                internalProperty.propertyValues.split(" ");

              for (const propertyValue of propertyValues) {
                try {
                  await element.assertPropertyValue(
                    internalProperty.propertyName,
                    propertyValue
                  );
                  this.webHelper.logSuccess(
                    `✅ - Property: ${internalProperty.propertyName} = "${propertyValue}" found for ${element.identifier}`
                  );
                  await this.page.waitForTimeout(100);
                } catch (error) {
                  this.webHelper.logError(
                    `❌ - Failed to assert property ${internalProperty.propertyName} = "${propertyValue}" for ${element.identifier}: ${error}`
                  );
                  throw error;
                }
              }

              await this.page.waitForTimeout(200);
            }
          }
        }
      }

      this.webHelper.logSuccess(
        `✅ All ${property} property assertions completed successfully`
      );
    } catch (error) {
      this.webHelper.logError(
        `❌ - Error asserting ${property} properties: ${error}`
      );
      throw error;
    }
  }
}

