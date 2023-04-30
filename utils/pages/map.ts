/** This module contains a page object model for the Map page */
import { Page, Locator, expect } from '@playwright/test';
import { MoreLayersConfig } from './widgets/map/moreLayersConfigWidget';
import { HDOTAssetsConfig } from './widgets/map/hdotAssetsConfigWidget';
import { MapPageSideBar } from './widgets/map/sidebar';

/** This class defines an abstraction of the Map page */
export class MapPage {
    readonly page: Page;
    readonly mapArea: Locator;
    readonly sidebar: MapPageSideBar;
    readonly moreLayersConfig: MoreLayersConfig;
    readonly hdotAssetsConfig: HDOTAssetsConfig;
    readonly zoomOutBtn: Locator;
    readonly zoomInBtn: Locator;
    readonly zoomLevel: Locator;

    constructor(page: Page) {
        this.page = page;
        this.mapArea = page.locator('canvas[aria-label="Map"]');
        this.sidebar = new MapPageSideBar(page);
        this.moreLayersConfig = new MoreLayersConfig(page);
        this.hdotAssetsConfig = new HDOTAssetsConfig(page);
        this.zoomOutBtn = page.locator('button[aria-label="Decrease zoom"]');
        this.zoomInBtn = page.locator('button[aria-label="Increase zoom"]');
        this.zoomLevel = page.locator('.MuiBox-root .MuiTypography-displayBlock');
    }

    async zoomIn() {
        await this.zoomLevel.textContent().then(async (val) => {
            const levelAsInt = parseInt(val!);
            await this.zoomInBtn.click();
            await expect(this.zoomLevel).toHaveText((levelAsInt + 1).toString());
        });
    }

    async zoomOut() {
        await this.zoomLevel.textContent().then(async (val) => {
            const levelAsInt = parseInt(val!);
            await this.zoomOutBtn.click();
            await expect(this.zoomLevel).toHaveText((levelAsInt - 1).toString());
        });
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
        await this.mapPage.page.waitForLoadState('networkidle');
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
    async paragraphTextContains({ paragraphIndex, text }: { paragraphIndex: number; text: string }) {
        await expect(this.mapPage.sidebar.textParagraphs.nth(paragraphIndex - 1)).toContainText(text);
    }

    /** Asserts that the Thematic Indices Facilities and Structures widget on the Insights sidebar tab is visible */
    async facilitiesAndStructuresWidgetIsVisibleWithValues() {
        const widget = this.mapPage.sidebar.facilitiesAndStructuresWidget;
        // TODO: What if some of the types doesn't have entries, should it be displayed in the widget?
        for (const el of [widget.preSchoolType, widget.fireStationType, widget.policeStationType]) {
            await expect(el).toBeVisible();
            el.locator('span:not(class)')
                .textContent()
                .then((val) => {
                    expect(parseInt(val!)).toBeGreaterThan(1);
                });
        }
    }

    /**
     * Asserts that the zoom level within the zoom widget is correct
     * @param {number} zoomLevel Expected zoom level
     */
    async zoomLevelIsCorrect(zoomLevel: number) {
        await expect(this.mapPage.zoomLevel).toHaveText(zoomLevel.toString());
    }
}
