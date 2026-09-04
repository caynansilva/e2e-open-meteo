import { WebElement } from "@core/WebElement";
import { WebPage } from "@core/WebPage";
import { Page } from "@playwright/test";
import { WebHelper } from "@utils/WebHelper";

export class GooglePage extends WebPage {

    public logoImage: WebElement;
    public searchInput: WebElement;
    public searchButton: WebElement;
    public searchResultsLink: WebElement;
    public quickResultsArea: WebElement;
    public recaptchaCheckbox: WebElement;

    constructor(page: Page) {
        super(page);
        this.setPageObjects();
    }

    public setPageObjects(): void {
        this.logoImage = new WebElement(this.page, {
            selector: '[role="img"]',
            identifier: "Logo Image"
        });
        this.searchInput = new WebElement(this.page, {
            selector: 'textarea[name="q"]',
            identifier: "Search Input"
        });
        this.searchButton = new WebElement(this.page, {
            selector: 'input[name="btnK"]',
            identifier: "Search Button"
        });
        this.searchResultsLink = new WebElement(this.page, {
            selector: 'span > a[class="zReHs"] > h3',
            identifier: "Search Results Link"
        });
        this.quickResultsArea = new WebElement(this.page, {
            selector: 'div[id="search"] > div > div > div:nth-child(1)',
            identifier: "Quick Results Area"
        });
        this.recaptchaCheckbox = new WebElement(this.page, {
            selector: '[id="recaptcha-anchor"]',
            identifier: "Recaptcha Checkbox"
        });
    }

    public async navigateToGoogle(): Promise<void> {
        await WebHelper.navigateToUrl(this.page, "https://www.google.com");
        await this.dismissRecaptchaIfVisible();
    }

    public async typeTextOnSearchInput(text: string): Promise<void> {
        return await this.searchInput.type(text);
    }

    public async clickSearchButton(): Promise<void> {
        await this.searchButton.click();
    }

    public async sendEnterKeyOnSearchInput(): Promise<void> {
        await WebHelper.sendKeys(this.page, "Enter");
        await this.dismissRecaptchaIfVisible();
    }

    public async clickSearchResultsLinkByIndex(index: number): Promise<void> {
        return await this.searchResultsLink.click(index);
    }

    public async getQuickResultsAreaText(): Promise<string> {
        return await this.quickResultsArea.getInternalText();
    }

    public async assertQuickResultsAreaTextContains(text: string): Promise<void> {
        return await this.quickResultsArea.shouldHaveText(text);
    }

    public async clickRecaptchaCheckbox(): Promise<void> {
        // reCAPTCHA checkbox lives inside an iframe, use frameLocator to access it
        const recaptchaFrame = this.page.frameLocator('iframe[title="reCAPTCHA"]');
        await recaptchaFrame.locator('#recaptcha-anchor').click();
    }

    public async dismissRecaptchaIfVisible(): Promise<void> {
        this.logMessage("Dismissing Recaptcha if visible");
        
        // Check if the reCAPTCHA iframe exists with a short timeout
        const recaptchaIframe = this.page.locator('iframe[title="reCAPTCHA"]');
        const isVisible = await recaptchaIframe.isVisible({ timeout: 3000 }).catch(() => false);
        
        if (isVisible) {
            this.logMessage("reCAPTCHA detected, attempting to click checkbox");
            await this.clickRecaptchaCheckbox();
        }
        
        await this.logoImage.waitElementToLoad();
    }
}
