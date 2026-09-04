import { Page } from "@playwright/test";

// Locator type inferred from Page.locator return type
type Locator = Awaited<ReturnType<Page['locator']>>;
import { HTMLElementType, IWebElement, IWebElementProperties } from "../Types";
import { PwHelper } from "../Utils/PwHelper";

/**
 * WebElement - Core element abstraction for Playwright
 * 
 * This class wraps Playwright locators with enhanced functionality:
 * - Automatic waiting and visibility handling
 * - Built-in assertion logging
 * - Element property management
 * - Multiple element handling
 */
export class WebElement {
  public _page: Page;
  public _selector: string;
  public _identifier: string;
  public _imageName: string;
  public _internalText: string;
  public _maestroSelector?: string;
  public _properties?: string[];
  public _propertiesList?: IWebElementProperties;
  public elementType: HTMLElementType;
  private pwHelper: PwHelper;

  constructor(
    page: Page,
    {
      selector,
      identifier,
      imageName,
      internalText,
      elementType,
      properties,
      propertiesList,
    }: IWebElement
  ) {
    this._page = page;
    this._selector = selector;
    this._identifier = identifier;
    this._imageName = imageName ?? "";
    this._internalText = internalText ?? "";
    this.elementType = elementType ?? HTMLElementType.Label;
    this._properties = properties ?? [];
    this._propertiesList = propertiesList as IWebElementProperties | undefined;
    this.pwHelper = new PwHelper();
  }

  public async getElement(): Promise<Locator> {
    return await this.page.locator(this.selector);
  }

  /**
   * Click this element - Framework handles everything automatically
   */
  public async click(elementIndex: number = 0): Promise<void> {
    return await this.pwHelper.simpleClick(
      this._page,
      this._selector,
      this._identifier,
      elementIndex
    );
  }

  public async clickByText(text: string, elementIndex = 0): Promise<void> {
    return await this.pwHelper.clickByText(
      this._page,
      this._selector,
      this._identifier,
      text,
      elementIndex
    );
  }

  public async delayedClick(delay: number = 1000): Promise<void> {
    return await this.pwHelper.delayedSimpleClick(
      this._page,
      this._selector,
      this._identifier,
      delay
    );
  }

  /**
   * Click specific positioned element when multiple elements exist
   */
  public async clickAtPosition(elementPosition: number = 0): Promise<void> {
    return await this.pwHelper.clickWhenMultipleElements(
      this._page,
      this._selector,
      this._identifier,
      elementPosition
    );
  }

  public async clickOnFirstElement(): Promise<void> {
    return await this.clickAtPosition(0);
  }

  /**
   * Force click this element
   */
  public async forceClick(): Promise<void> {
    await this.page.waitForTimeout(500);
    return await this.pwHelper.forcedClick(
      this._page,
      this._selector,
      this._identifier
    );
  }

  public async doubleClick(): Promise<void> {
    return await this.pwHelper.doubleClick(
      this._page,
      this._selector,
      this._identifier
    );
  }

  /**
   * Click this element after a delay
   */
  public async clickAfterDelay(delay: number = 1000): Promise<void> {
    return await this.pwHelper.delayedSimpleClick(
      this._page,
      this._selector,
      this._identifier,
      delay
    );
  }

  /**
   * Type text into this element
   */
  public async type(text: string, elementIndex: number = 0): Promise<void> {
    return await this.pwHelper.inputText(
      this._page,
      this._selector,
      this._identifier,
      text,
      elementIndex
    );
  }

  public async typeSecretText(
    text: string,
    elementIndex: number = 0
  ): Promise<void> {
    return await this.pwHelper.inputSecretText(
      this._page,
      this._selector,
      this._identifier,
      text,
      elementIndex
    );
  }

  /**
   * Assert this element contains expected text
   */
  public async shouldHaveText(expectedText: string): Promise<void> {
    return await this.pwHelper.assertElementText(
      this._page,
      this._selector,
      this._identifier,
      expectedText
    );
  }

  /**
   * Wait for this element to be visible
   */
  public async waitToBeVisible(timeout: number = 60000): Promise<void> {
    return await this.pwHelper.waitElementToLoad(
      this._page,
      this._selector,
      this._identifier,
      timeout
    );
  }

  /**
   * Alias for click() - more descriptive
   */
  public async simpleClick(): Promise<void> {
    return await this.click();
  }

  /**
   * Click this element if it is visible
   */
  public async clickIfVisible(
    index: number = 0,
    timeout: number = 10000
  ): Promise<void> {
    return await this.pwHelper.clickIfVisible(
      this._page,
      this._selector,
      this._identifier,
      index,
      timeout
    );
  }

  /**
   * Click when multiple elements - more descriptive method name
   */
  public async clickWhenMultiple(elementPosition: number = 0): Promise<void> {
    return await this.clickAtPosition(elementPosition);
  }

  /**
   * Click the first occurrence - explicit method name
   */
  public async clickFirst(): Promise<void> {
    return await this.clickAtPosition(0);
  }

  /**
   * Click the second occurrence - explicit method name
   */
  public async clickSecond(): Promise<void> {
    return await this.clickAtPosition(1);
  }

  /**
   * Click the third occurrence - explicit method name
   */
  public async clickThird(): Promise<void> {
    return await this.clickAtPosition(2);
  }

  /**
   * Fill text - more descriptive than type
   */
  public async fill(text: string): Promise<void> {
    return await this.type(text);
  }

  public async typeText(text: string, elementIndex: number = 0): Promise<void> {
    return await this.type(text, elementIndex);
  }

  public async clearText(): Promise<void> {
    return await this.fill("");
  }

  /**
   * Clear and type text - unified across frameworks
   */
  public async clearAndType(text: string): Promise<void> {
    return await this.type(text);
  }

  /**
   * Run a callback when an element is present or not present
   */
  public async runWhenElementPresenceIs(
    presence: boolean,
    callback: () => Promise<void>
  ): Promise<void> {
    return await this.pwHelper.runWhenElementPresenceIs(
      this._page,
      this._selector,
      this._identifier,
      presence,
      callback
    );
  }

  /**
   * Get a quantity of elements with the same selector
   */
  public getElementsQuantity(): Promise<number> | number {
    const result = this.pwHelper.getElementsQuantity(
      this._page,
      this._selector,
      this._identifier
    );
    return result as any;
  }

  /**
   * Use element count in a callback - Framework magic handles the rest
   */
  public async useElementsQuantity(
    callback: (count: number) => Promise<void> | void
  ): Promise<void> {
    const count = await this.pwHelper.getElementsQuantity(
      this._page,
      this._selector,
      this._identifier
    );
    const callbackResult = callback(count);
    if (
      callbackResult &&
      typeof callbackResult === "object" &&
      "then" in callbackResult
    ) {
      await callbackResult;
    }
  }

  /**
   * Perform an action for each element sequentially
   */
  public async forEachElement(
    action: () => Promise<void> | void
  ): Promise<void> {
    await this.useElementsQuantity(async (count: number) => {
      for (let i = 0; i < count; i++) {
        const actionResult = action();
        if (
          actionResult &&
          typeof actionResult === "object" &&
          "then" in actionResult
        ) {
          await actionResult;
        }
      }
    });
  }

  /**
   * Click all elements (always clicks the first since each click removes one)
   */
  public async clickOnAllElements(): Promise<void> {
    return await this.forEachElement(() => this.clickAtPosition(0));
  }

  public async logMessage(message: string): Promise<void> {
    return await this.pwHelper.logMessage(message);
  }

  // Getters
  get selector(): string {
    return this._selector;
  }

  get identifier(): string {
    return this._identifier;
  }

  get page(): Page {
    return this._page;
  }

  get imageName(): string | undefined {
    return this._imageName;
  }

  get maestroSelector(): string | undefined {
    return this._maestroSelector;
  }

  get properties(): string[] | undefined {
    return this._properties;
  }

  get propertiesList(): IWebElementProperties[] | undefined {
    if (Array.isArray(this._propertiesList)) {
      return this._propertiesList;
    }
    return undefined;
  }

  // Setters
  public set selector(selector: string) {
    this._selector = selector;
  }

  public set identifier(identifier: string) {
    this._identifier = identifier;
  }

  public set imageName(imageName: string) {
    this._imageName = imageName;
  }

  public set internalText(internalText: string) {
    this._internalText = internalText;
  }

  public set properties(properties: string[]) {
    this._properties = properties;
  }

  public set propertiesList(propertiesList: IWebElementProperties | undefined) {
    this._propertiesList = propertiesList as IWebElementProperties | undefined;
  }

  /**
   * String representation for debugging
   */
  public toString(): string {
    return `WebElement(${this._identifier}): ${this._selector}`;
  }

  public async shouldBeVisible(elementIndex: number = 0): Promise<void> {
    await this.page.waitForTimeout(500);
    return this.pwHelper.assertElementVisibility(
      this._page,
      this._selector,
      this._identifier,
      true,
      elementIndex
    );
  }

  public async shouldNotBeVisible(elementIndex: number = 0): Promise<void> {
    await this.page.waitForTimeout(500);
    return this.pwHelper.assertElementVisibility(
      this._page,
      this._selector,
      this._identifier,
      false,
      elementIndex
    );
  }

  /**
   * Wait for element to reach a specific visibility state
   */
  public async waitForVisibilityState(
    state: boolean,
    elementIndex: number = 0,
    timeout: number = 60000
  ): Promise<void> {
    if (state === true) {
      return await this.waitElementToLoad(elementIndex);
    } else {
      return await this.pwHelper.waitElementToBeHidden(
        this._page,
        this._selector,
        this._identifier,
        timeout,
        elementIndex
      );
    }
  }

  public async waitElementToLoad(
    elementIndex: number = 0,
    timeout: number = 60000
  ): Promise<void> {
    return await this.pwHelper.waitElementToLoad(
      this._page,
      this._selector,
      this._identifier,
      timeout,
      elementIndex
    );
  }

  public async assertElementImageIsValid(
    elementIndex: number = 0
  ): Promise<void> {
    return this.pwHelper.assertElementImageIsValid(
      this._page,
      this._selector,
      this._identifier,
      elementIndex
    );
  }

  public async assertElementIsChecked(elementIndex: number = 0): Promise<void> {
    return this.pwHelper.assertElementIsChecked(
      this._page,
      this._selector,
      this._identifier,
      elementIndex
    );
  }

  public async assertElementIsNotChecked(
    elementIndex: number = 0
  ): Promise<void> {
    return await this.pwHelper.assertElementIsNotChecked(
      this._page,
      this._selector,
      this._identifier,
      elementIndex
    );
  }

  public async getCheckedState(elementIndex: number = 0): Promise<boolean> {
    return this.pwHelper.getCheckedState(
      this._page,
      this._selector,
      this._identifier,
      elementIndex
    );
  }

  public async selectOption(
    optionPosition: number,
    elementIndex: number = 0
  ): Promise<void> {
    return await this.pwHelper.selectOption(
      this._page,
      this._selector,
      this._identifier,
      optionPosition,
      elementIndex
    );
  }

  public async assertInternalText(elementIndex: number = 0): Promise<void> {
    return await this.pwHelper.assertElementText(
      this._page,
      this._selector,
      this._identifier,
      this._internalText,
      elementIndex
    );
  }

  public async assertInternalTextContains(
    elementIndex: number = 0
  ): Promise<void> {
    return await this.pwHelper.assertElementTextContains(
      this._page,
      this._selector,
      this._identifier,
      this._internalText,
      elementIndex
    );
  }

  public async sendEnterKey(): Promise<void> {
    return await this.pwHelper.sendKEnterKey(this._page, this.selector);
  }

  public async assertImageIsVisible(): Promise<void> {
    return await this.pwHelper.assertImageIsVisible(
      this._page,
      this.selector,
      this._imageName
    );
  }

  public async assertImageNameAttribute(): Promise<void> {
    return await this.pwHelper.assertImageNameAttribute(
      this._page,
      this.selector,
      this._imageName
    );
  }

  public async assertRadioItemIsSelected(): Promise<void> {
    return await this.pwHelper.assertRadioItemIsSelected(
      this._page,
      this.selector,
      this._identifier
    );
  }

  public async assertRadioItemIsNotSelected(): Promise<void> {
    return await this.pwHelper.assertRadioItemIsNotSelected(
      this._page,
      this.selector,
      this._identifier
    );
  }

  public async getElementVisibilityStatus(index: number = 0): Promise<boolean> {
    return await this.pwHelper.getElementVisibilityStatus(
      this._page,
      this.selector,
      this._identifier,
      index
    );
  }

  public async getInternalText(
    position: number = 0,
    timeout: number = 60000
  ): Promise<string> {
    return await this.pwHelper.getInternalText(
      this._page,
      this.selector,
      position,
      timeout
    );
  }

  public async getInputText(position: number = 0): Promise<string> {
    return await this.pwHelper.getInputText(
      this._page,
      this.selector,
      position
    );
  }

  public async waitForText(
    text: string,
    timeout: number = 60000
  ): Promise<void> {
    return await this.pwHelper.waitForText(
      this._page,
      this.selector,
      text,
      timeout
    );
  }

  public async waitForTextToBeEqualTo(
    text: string,
    timeout: number = 60000,
    index: number = 0
  ): Promise<void> {
    return await this.pwHelper.waitForElementTextToBeEqualTo(
      this._page,
      this.selector,
      text,
      timeout,
      index
    );
  }

  public async assertPropertyValue(
    property: string,
    value: string,
    index: number = 0
  ): Promise<void> {
    return await this.pwHelper.assertPropertyValue(
      this._page,
      this.selector,
      this._identifier,
      property,
      value,
      index
    );
  }

  public async assertElementHasProperty(
    property: string,
    index: number = 0
  ): Promise<void> {
    return await this.pwHelper.assertElementHasProperty(
      this._page,
      this.selector,
      property,
      index
    );
  }

  public async assertElementDontHaveProperty(
    property: string,
    index: number = 0
  ): Promise<void> {
    return await this.pwHelper.assertElementDontHaveProperty(
      this._page,
      this.selector,
      property,
      index
    );
  }

  public async isElementPresent(): Promise<boolean> {
    return await this.pwHelper.isElementPresent(this._page, this.selector);
  }

  public async shouldContainText(
    text: string,
    elementIndex: number = 0
  ): Promise<void> {
    return await this.pwHelper.assertElementTextContains(
      this._page,
      this.selector,
      this._identifier,
      text,
      elementIndex
    );
  }

  public async shouldNotExist(): Promise<void> {
    return await this.pwHelper.assertElementNotExists(
      this._page,
      this.selector,
      this._identifier
    );
  }

  public async hover(): Promise<void> {
    return await this.pwHelper.hover(this._page, this.selector);
  }

  public async getPlaceholderText(): Promise<string> {
    return await this.pwHelper.getPlaceholderText(this._page, this.selector);
  }

  public async findElementWithText(text: string): Promise<Locator> {
    return await this.pwHelper.findElementWithText(
      this._page,
      this.selector,
      text
    );
  }

  public async geElementVisibilityStatusWithTimeout(
    index: number = 0,
    timeout: number = 10000
  ): Promise<boolean> {
    return await this.pwHelper.getElementVisibilityStatusWithTimeout(
      this._page,
      this.selector,
      index,
      timeout
    );
  }

  public async waitForTextDifferentThan(
    text: string,
    timeout: number = 60000
  ): Promise<void> {
    return await this.pwHelper.waitForTextDifferentThan(
      this._page,
      this.selector,
      text,
      timeout
    );
  }

  public async assertPlaceholderText(elementIndex: number = 0): Promise<void> {
    return await this.pwHelper.assertPlaceholderText(
      this._page,
      this.selector,
      this._identifier,
      elementIndex
    );
  }
}

