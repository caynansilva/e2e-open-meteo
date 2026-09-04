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

  // Hero Section Elements
  public pageHeroSection: WebElement;
  public pageHeroIcon: WebElement;
  public pageHeroTitle: WebElement;
  public pageHeroDescription: WebElement;
  public pageHeroActionButton: WebElement;

  // Search and Filter Section Elements
  public pageSearchInput: WebElement;
  public pageSearchResultsLabel: WebElement;
  public pageClearResultsButton: WebElement;
  public pageClearFiltersButton: WebElement;
  public pageFilterDropdown: WebElement;
  public pageFilterDropdownOption: WebElement;

  // Toggle View Section Elements
  public pageToggleCardsViewButton: WebElement;
  public pageToggleListViewButton: WebElement;
  public pageToggleViewButton: WebElement;

  // Card Gallery Elements
  public pageCardGallery: WebElement;
  public pageCardItem: WebElement;
  public pageListItem: WebElement;
  public pageCardTitle: WebElement;
  public pageCardDescription: WebElement;
  public pageCardMoreOptionsButton: WebElement;
  public pageCardStatusLabel: WebElement;

  // More Options Elements
  public pageMoreOptionsEditIcon: WebElement;
  public pageMoreOptionsEditText: WebElement;
  public pageMoreOptionsDuplicateIcon: WebElement;
  public pageMoreOptionsDuplicateText: WebElement;
  public pageMoreOptionsPauseIcon: WebElement;
  public pageMoreOptionsPauseText: WebElement;
  public pageMoreOptionsDeleteIcon: WebElement;
  public pageMoreOptionsDeleteText: WebElement;
  public pageMoreOptionsActivateText: WebElement;
  public pageMoreOptionsActivateIcon: WebElement;

  // NextJs Element Indicator (for development environments)
  public pageNextJsIndicator: WebElement;
  public pageNextJsErrorIndicator: WebElement;

  // No Results Elements
  public pageNoResultsIcon: WebElement;
  public pageNoResultsTitle: WebElement;
  public pageNoResultsDescription: WebElement;
  public pageNoResultsButton: WebElement;
  public pageNoResultsActionButton: WebElement;

  // Custom Fields Elements (for flexible card data)
  public pageCardCustomFieldOne: WebElement;
  public pageCardCustomFieldTwo: WebElement;
  public pageCardCustomFieldThree: WebElement;
  public pageCardCustomFieldFour: WebElement;
  public pageCardCustomFieldFive: WebElement;
  public pageCardCustomFieldSix: WebElement;
  public pageCardCustomFieldSeven: WebElement;
  public pageCardCustomFieldEight: WebElement;
  public pageCardCustomFieldNine: WebElement;
  public pageCardCustomFieldTen: WebElement;

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

  /**
   * Get the options names from the dropdown
   */
  public async getDropdownOptionsNames(): Promise<string[]> {
    const optionsNames: string[] = [];
    const optionsQuantity =
      await this.pageFilterDropdownOption.getElementsQuantity();
    for (let i = 0; i < optionsQuantity; i++) {
      optionsNames.push(await this.pageFilterDropdownOption.getInternalText(i));
    }
    this.webHelper.logSuccess(
      `Retrieved ${optionsNames.length} options on the dropdown`
    );
    return optionsNames;
  }

  // Common assertion methods for standard page sections
  public async assertPageHeaderTitleElementIsPresent(): Promise<void> {
    await this.pageHeaderTitle.shouldBeVisible();
  }

  public async assertPageHeaderTitleInternalText(): Promise<void> {
    await this.pageHeaderTitle.waitElementToLoad();
    await this.pageHeaderTitle.assertInternalText();
  }

  public async assertPageHeaderDescriptionElementIsPresent(): Promise<void> {
    await this.pageHeaderDescription.shouldBeVisible();
  }

  public async assertPageHeaderDescriptionInternalText(): Promise<void> {
    await this.pageHeaderDescription.waitElementToLoad();
    await this.pageHeaderDescription.assertInternalText();
  }

  // Hero Section Elements
  public async assertPageHeroSectionElementIsPresent(): Promise<void> {
    await this.pageHeroSection.shouldBeVisible();
  }

  public async assertPageHeroIconElementIsPresent(): Promise<void> {
    await this.pageHeroIcon.shouldBeVisible();
  }

  public async assertPageHeroTitleElementIsPresent(): Promise<void> {
    await this.pageHeroTitle.shouldBeVisible();
  }

  public async assertPageHeroTitleInternalText(): Promise<void> {
    await this.pageHeroTitle.waitElementToLoad();
    await this.pageHeroTitle.assertInternalText();
  }

  public async assertPageHeroDescriptionElementIsPresent(): Promise<void> {
    await this.pageHeroDescription.shouldBeVisible();
  }

  public async assertPageHeroDescriptionInternalText(): Promise<void> {
    await this.pageHeroDescription.waitElementToLoad();
    await this.pageHeroDescription.assertInternalText();
  }

  public async assertPageHeroActionButtonElementIsPresent(): Promise<void> {
    await this.pageHeroActionButton.shouldBeVisible();
  }

  public async assertPageHeroActionButtonInternalText(): Promise<void> {
    await this.pageHeroActionButton.waitElementToLoad();
    await this.pageHeroActionButton.assertInternalText();
  }

  // Search and Filter Section assertions
  public async assertPageSearchInputElementIsPresent(): Promise<void> {
    await this.pageSearchInput.shouldBeVisible();
  }

  public async assertPageSearchInputPlaceholderText(): Promise<void> {
    await this.pageSearchInput.waitElementToLoad();
    await this.pageSearchInput.assertPlaceholderText();
  }

  // Card Gallery assertions
  public async assertPageCardGalleryElementIsPresent(): Promise<void> {
    await this.pageCardGallery.shouldBeVisible();
  }

  public async assertPageCardItemElementIsPresent(): Promise<void> {
    await this.pageCardItem.shouldBeVisible();
  }

  public async assertPageCardTitleElementIsPresent(): Promise<void> {
    await this.pageCardTitle.shouldBeVisible();
  }

  // Common Page Behaviors
  public async typeOnSearchInput(text: string): Promise<void> {
    await this.pageSearchInput.waitElementToLoad();
    await this.pageSearchInput.type(text);
  }

  public async clearSearchInput(): Promise<void> {
    await this.pageSearchInput.waitElementToLoad();
    await this.pageSearchInput.clearText();
  }

  public async clearSearchResults(): Promise<void> {
    await this.pageClearResultsButton.waitElementToLoad();
    await this.pageClearResultsButton.simpleClick();
  }

  public async clearFiltersResults(): Promise<void> {
    await this.pageClearFiltersButton.waitElementToLoad();
    await this.pageClearFiltersButton.simpleClick();
  }

  public async isOnCardView(): Promise<boolean> {
    return await this.pageCardItem.getElementVisibilityStatus();
  }

  public async toggleViewToListView(): Promise<void> {
    if (await this.isOnCardView()) {
      await this.pageToggleViewButton.simpleClick();
      await this.pageListItem.waitElementToLoad();
    }
    this.webHelper.logSuccess("View changed from card view to list view");
  }

  public async isOnListView(): Promise<boolean> {
    return await this.pageListItem.getElementVisibilityStatus();
  }

  public async toggleViewToCardView(): Promise<void> {
    if (await this.isOnListView()) {
      await this.pageToggleViewButton.simpleClick();
      await this.pageCardItem.waitElementToLoad();
    }
  }

  public async toggleMoreOptions(): Promise<void> {
    await this.pageCardMoreOptionsButton.waitElementToLoad();
    await this.pageCardMoreOptionsButton.simpleClick();
  }

  public async clickOnEditOption(): Promise<void> {
    await this.pageMoreOptionsEditText.waitElementToLoad();
    await this.pageMoreOptionsEditText.simpleClick();
  }

  public async clickOnDuplicateOption(): Promise<void> {
    await this.pageMoreOptionsDuplicateText.waitElementToLoad();
    await this.pageMoreOptionsDuplicateText.simpleClick();
  }

  public async clickOnPauseOption(): Promise<void> {
    await this.pageMoreOptionsPauseText.waitElementToLoad();
    await this.pageMoreOptionsPauseText.simpleClick();
  }

  public async clickOnDeleteOption(): Promise<void> {
    await this.pageMoreOptionsDeleteText.waitElementToLoad();
    await this.pageMoreOptionsDeleteText.simpleClick();
  }

  public async clickOnActivateOption(): Promise<void> {
    await this.pageMoreOptionsActivateText.waitElementToLoad();
    await this.pageMoreOptionsActivateText.simpleClick();
  }

  public async editCardItem(): Promise<void> {
    await this.toggleMoreOptions();
    await this.clickOnEditOption();
  }

  public async duplicateCardItem(): Promise<void> {
    await this.toggleMoreOptions();
    await this.clickOnDuplicateOption();
  }

  public async pauseCardItem(): Promise<void> {
    await this.toggleMoreOptions();
    await this.clickOnPauseOption();
  }

  public async deleteCardItem(): Promise<void> {
    await this.toggleMoreOptions();
    await this.clickOnDeleteOption();
  }

  public async activateCardItem(): Promise<void> {
    await this.toggleMoreOptions();
    await this.clickOnActivateOption();
  }

  // Card Assertions
  public async assertCardTitleTextContains(text: string): Promise<void> {
    this.webHelper.logMessage(`Asserting card title text contains: ${text}`);
    const cardTitleText = await this.pageCardTitle.getInternalText();
    this.webHelper.assert(
      cardTitleText.toUpperCase().includes(text.toUpperCase()),
      `Success: Card title text contains: ${text.toUpperCase()}`,
      `Failed: Card title text does not contain: ${text.toUpperCase()}`
    );
  }

  public async assertCardStatusTextContains(text: string): Promise<void> {
    this.webHelper.logMessage(`Asserting card status text contains: ${text}`);
    const cardStatusText = await this.pageCardStatusLabel.getInternalText();
    this.webHelper.assert(
      cardStatusText.toUpperCase().includes(text.toUpperCase()),
      `Success: Card status text contains: ${text.toUpperCase()}`,
      `Failed: Card status text does not contain: ${text.toUpperCase()}`
    );
  }

  // Data Retrieval Methods
  public async getQuantityOfCardElementsOnScreen(): Promise<number> {
    return await this.pageCardItem.getElementsQuantity();
  }

  public async getRandomCardElementIndex(): Promise<number> {
    const quantity = await this.getQuantityOfCardElementsOnScreen();
    return await this.webHelper.getRandomNumber(0, quantity - 1);
  }

  public async getCardElementTitleData(index: number): Promise<string> {
    return await this.pageCardTitle.getInternalText(index);
  }

  public async getCardElementDescriptionData(index: number): Promise<string> {
    return await this.pageCardDescription.getInternalText(index);
  }

  public async getCardElementStatusData(index: number): Promise<string> {
    return await this.pageCardStatusLabel.getInternalText(index);
  }

  public async getCardElementData(index: number): Promise<CardData> {
    const cardData: CardData = {
      cardTitle: await this.getCardElementTitleData(index),
      cardDescription: await this.getCardElementDescriptionData(index),
      cardStatus: await this.getCardElementStatusData(index),
    };
    return cardData;
  }

  public async getFirstCardItemDataFromScreen(): Promise<CardData> {
    return await this.getCardElementData(0);
  }

  public async getLastCardItemDataFromScreen(): Promise<CardData> {
    const index = (await this.getQuantityOfCardElementsOnScreen()) - 1;
    return await this.getCardElementData(index);
  }

  public async getRandomCardItemDataFromScreen(): Promise<CardData> {
    const index = await this.getRandomCardElementIndex();
    return await this.getCardElementData(index);
  }

  public async waitPageToLoad(): Promise<void> {
    this.logMessage("Waiting for page to load");
    await this.pageHeroSection.waitElementToLoad();
  }

  public async waitFilterResultsToLoad(): Promise<void> {
    this.logMessage("Waiting for filter results to load");
    await this.page.waitForTimeout(500);
  }

  // Development Environment checks
  private isOnDevEnvironment(): boolean {
    return (
      this.envVariables.getCurrentEnvironment() === "development" ||
      this.envVariables.getCurrentEnvironment() === "local"
    );
  }

  public async assertPageNextJsIndicatorElementIsPresent(): Promise<void> {
    if (this.isOnDevEnvironment()) {
      await this.pageNextJsIndicator.shouldBeVisible();
    }
  }

  public async assertPageNextJsErrorIndicatorIsNotPresent(): Promise<void> {
    await this.pageNextJsErrorIndicator.shouldNotBeVisible();
  }

  // No Results Elements
  public async assertPageNoResultsTitleElementIsPresent(): Promise<void> {
    await this.pageNoResultsTitle.shouldBeVisible();
  }

  public async assertPageNoResultsDescriptionElementIsPresent(): Promise<void> {
    await this.pageNoResultsDescription.shouldBeVisible();
  }

  public async assertPageNoResultsButtonElementIsPresent(): Promise<void> {
    await this.pageNoResultsButton.shouldBeVisible();
  }
}

