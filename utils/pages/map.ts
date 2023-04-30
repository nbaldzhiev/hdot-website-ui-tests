/** This module contains a page object model for the Map page */
import { Page, Locator, expect } from '@playwright/test';

class ThematicIndicesFacilitiesAndStructuresWidget {
    readonly page: Page;
    readonly selectedMsg: Locator;
    readonly preSchoolType: Locator;
    readonly fireStationType: Locator;
    readonly policeStationType: Locator;

    constructor(page: Page) {
        this.page = page;
        let parent = 'section[aria-label="Facilities and Structures"]';
        this.selectedMsg = page.locator(`${parent} span.MuiTypography-caption`);
        this.preSchoolType = page.locator(`${parent} div.MuiGrid-item > div.MuiGrid-spacing-xs-1:first-child`);
        this.fireStationType = page.locator(`${parent} div.MuiGrid-item > div.MuiGrid-spacing-xs-1:nth-child(2)`);
        this.policeStationType = page.locator(`${parent} div.MuiGrid-item > div.MuiGrid-spacing-xs-1:last-child`);
    }

    async selectPreSchoolType() {
        await this.preSchoolType.click();
        await expect(this.selectedMsg).toContainText('1 selected');
    }
}

class CategoriesVerticalBar {
    readonly page: Page;
    readonly thematicIndicesBtn: Locator;

    constructor(page: Page) {
        this.page = page;
        this.thematicIndicesBtn = page.locator('a[aria-label="Thematic Indices"]');
    }

    async openThematicIndices() {
        await this.page.keyboard.press('Escape');
        const classVal = await this.thematicIndicesBtn.getAttribute('class');
        if (!classVal?.includes('Mui-selected')) {
            this.thematicIndicesBtn.click();
        }
        await expect(this.thematicIndicesBtn).toHaveClass(/Mui-selected/);
    }
}

class MoreLayersConfig {
    readonly page: Page;
    readonly btn: Locator;
    readonly popup: Locator;
    readonly facilitiesAndStructuresToggle: Locator;

    constructor(page: Page) {
        this.page = page;
        this.btn = page.getByText('More Layers');
        this.popup = page.locator('.MuiPopover-paper');
        this.facilitiesAndStructuresToggle = this.popup.locator(
            '.MuiGrid-direction-xs-column + div > div:first-child > li:first-child span.MuiIconButton-root'
        );
    }

    async expand() {
        await this.page.keyboard.press('Escape');
        await expect(this.popup).toBeHidden();
        // use one of the toggles as means to verify popup is visible or not
        await this.facilitiesAndStructuresToggle.isVisible().then(async (state) => {
            if (!state) {
                await this.btn.click();
            }
        })
        await expect(this.facilitiesAndStructuresToggle).toBeVisible();
    }

    async toggleFacilitiesAndStructures(on: boolean = true) {
        await this.expand();
        const classVal = await this.facilitiesAndStructuresToggle.getAttribute('class');
        if (on && !classVal?.includes('Mui-checked')) {
            await this.facilitiesAndStructuresToggle.click();
            await expect(this.facilitiesAndStructuresToggle).toHaveClass(/Mui-checked/)
        } else if (!on && classVal?.includes('Mui-checked')) {
            await this.facilitiesAndStructuresToggle.click();
            await expect(this.facilitiesAndStructuresToggle).not.toHaveClass(/Mui-checked/)
        }
        await this.page.waitForLoadState('networkidle');
    }

}

class HDOTAssetsConfig {
    readonly page: Page;
    readonly popup: Locator;
    readonly btn: Locator;
    readonly unselectAllBtn: Locator;
    readonly selectedMsg: Locator;

    constructor(page: Page) {
        this.page = page;
        this.btn = page.locator('button[aria-controls="simple-menu"] span', { hasText: 'HDOT Assets' });
        this.popup = page.locator('.MuiPopover-paper');
        this.unselectAllBtn = this.popup.locator('button.MuiButton-disableElevation');
        this.selectedMsg = this.popup.locator('button.MuiButton-disableElevation + p');
    }

    async expand() {
        await this.page.keyboard.press('Escape');
        await expect(this.popup).toBeHidden();
        // use the Unselect all button as means to verify popup is visible or not
        await this.unselectAllBtn.isVisible().then(async (state) => {
            if (!state) {
                await this.btn.click();
            }
        })
        await expect(this.unselectAllBtn).toBeVisible();
    }

    async unselectAll() {
        await this.page.waitForLoadState('networkidle');
        await this.expand();
        const classVal = await this.unselectAllBtn.getAttribute('class');
        if (!classVal?.includes('Mui-disabled')) {
            await this.unselectAllBtn.click();
        }
        await expect(this.unselectAllBtn).toHaveClass(/Mui-disabled/);
        await expect(this.selectedMsg).toContainText(/0 selected/)
    }
}

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
    readonly informationTab: Locator;
    readonly insightsTab: Locator;
    readonly title: Locator;
    readonly textParagraphs: Locator;
    readonly hdotAssetsByTypeWidget: HDOTAssetsByTypeWidget;
    readonly categoriesVerticalBar: CategoriesVerticalBar;
    readonly facilitiesAndStructuresWidget: ThematicIndicesFacilitiesAndStructuresWidget;

    constructor(page: Page) {
        this.page = page;
        this.logo = page.locator(`${this.parentSelector} header svg`);
        this.informationTab = page.locator(`${this.parentSelector} a[aria-label="Information"]`);
        this.insightsTab = page.locator(`${this.parentSelector} a[aria-label="Insights"]`);
        this.title = page.locator(`${this.parentSelector} h4.MuiTypography-root`);
        this.textParagraphs = page.locator(`${this.parentSelector} p.MuiTypography-paragraph`);
        this.hdotAssetsByTypeWidget = new HDOTAssetsByTypeWidget(page);
        this.categoriesVerticalBar = new CategoriesVerticalBar(page);
        this.facilitiesAndStructuresWidget = new ThematicIndicesFacilitiesAndStructuresWidget(page);
    }

    async goToInformationTab() {
        await this.page.keyboard.press('Escape');
        const classVal = await this.informationTab.getAttribute('class');
        if (!classVal?.includes('Mui-selected')) {
            this.informationTab.click();
        }
        await expect(this.informationTab).toHaveClass(/Mui-selected/);
    }

    async goToInsightsTab() {
        await this.page.keyboard.press('Escape');
        const classVal = await this.insightsTab.getAttribute('class');
        if (!classVal?.includes('Mui-selected')) {
            this.insightsTab.click();
        }
        await expect(this.insightsTab).toHaveClass(/Mui-selected/);
    }
}

/** This class defines an abstraction of the Map page */
export class MapPage {
    readonly page: Page;
    readonly mapArea: Locator;
    readonly sidebar: MapPageSideBar;
    readonly moreLayersConfig: MoreLayersConfig;
    readonly hdotAssetsConfig: HDOTAssetsConfig;

    constructor(page: Page) {
        this.page = page;
        this.mapArea = page.locator('canvas[aria-label="Map"]');
        this.sidebar = new MapPageSideBar(page);
        this.moreLayersConfig = new MoreLayersConfig(page);
        this.hdotAssetsConfig = new HDOTAssetsConfig(page);
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
    async paragraphTextContains({ paragraphIndex, text }: { paragraphIndex: number, text: string }) {
        await expect(this.mapPage.sidebar.textParagraphs.nth(paragraphIndex - 1)).toContainText(text);
    }

    /** Asserts that the Thematic Indices Facilities and Structures widget on the Insights sidebar tab is visible */
    async facilitiesAndStructuresWidgetIsVisibleWithValues() {
        const widget = this.mapPage.sidebar.facilitiesAndStructuresWidget;
        // TODO: What if some of the types doesn't have entries, should it be displayed in the widget?
        for (const el of [widget.preSchoolType, widget.fireStationType, widget.policeStationType]) {
            await expect(el).toBeVisible();
            el.locator('span:not(class)').textContent().then((val) => {
                expect(parseInt(val!)).toBeGreaterThan(1);
            })
        }
    }
}