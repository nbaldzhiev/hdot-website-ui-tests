/** This module contains a page object model for the Map page */
import { Page, Locator, expect } from '@playwright/test';

class HDOTAssetsByTypeWidget {
    readonly title: Locator;
    readonly bridgeType: Locator;
    readonly roadwayType: Locator;
    readonly culvertType: Locator;
    readonly tunnelType: Locator;

    constructor(page: Page) {
        let selector = '[aria-label="HDOT Assets by Type"] div.MuiGrid-item > div.MuiGrid-spacing-xs-1';
        this.title = page.locator('h6[title="HDOT Assets by Type"]')
        this.bridgeType = page.locator(`${selector}:first-child`);
        this.roadwayType = page.locator(`${selector}:nth-child(2)`);
        this.culvertType = page.locator(`${selector}:nth-child(3)`);
        this.tunnelType = page.locator(`${selector}:last-child`);
    }
}

class MapPageSideBar {
    readonly parentSelector: string = '.MuiGrid-grid-xs-true > .MuiBox-root > div:first-child';

    readonly page: Page;
    readonly logo: Locator;
    readonly title: Locator;
    readonly textParagraphs: Locator;
    readonly hdotAssetsByTypeWidget: HDOTAssetsByTypeWidget;

    constructor(page: Page) {
        this.logo = page.locator(`${this.parentSelector} header svg`);
        this.title = page.locator(`${this.parentSelector} h4.MuiTypography-root`);
        this.textParagraphs = page.locator(`${this.parentSelector} p.MuiTypography-paragraph`);
        this.hdotAssetsByTypeWidget = new HDOTAssetsByTypeWidget(page);
    }
}

/** This class defines an abstraction of the Map page */
export class MapPage {
    readonly page: Page;
    readonly mapArea: Locator;
    readonly sidebar: MapPageSideBar;

    constructor(page: Page) {
        this.page = page;
        this.mapArea = page.locator('canvas[aria-label="Map"]');
        this.sidebar = new MapPageSideBar(page);
    }

    /**
     * Returns a MapPageAssertions object as an interface to invoking assertions on the page
     * @returns {MapPageAssertions}
     */
    get assertThat(): MapPageAssertions {
        return new MapPageAssertions(this);
    }
}

class MapPageAssertions {
    readonly mapPage: MapPage;

    constructor(page: MapPage) {
        this.mapPage = page;
    }

    /** Asserts that the map is visible */
    async mapIsVisible() {
        await expect(this.mapPage.mapArea).toBeVisible();
    }

    /** Asserts that the HDOT Assets By Type widget in the sidebar is visible */
    async hdotAssetsByTypeWidgetIsVisible() {
        const widget = this.mapPage.sidebar.hdotAssetsByTypeWidget;
        // TODO: What if some of the types doesn't have entries, should it be displayed in the widget?
        for (const el of [widget.bridgeType, widget.culvertType, widget.roadwayType, widget.tunnelType, widget.title]) {
            await expect(el).toBeVisible();
        }
    }

    /** Asserts that the title of the section in the sidebar is the expected one
     * @param {string} title The expected title
     */
    async titleSectionIsCorrect(title: string) {
        await expect(this.mapPage.sidebar.title).toHaveText(title);
    }

    /** Asserts that the title of the section in the sidebar is the expected one
     * @param {string} title The expected title
     */
    async paragraphTextContains({ paragraphIndex, text }: { paragraphIndex: number, text: string }) {
        await expect(this.mapPage.sidebar.textParagraphs.nth(paragraphIndex - 1)).toContainText(text);
    }
}