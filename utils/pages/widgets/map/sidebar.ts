/** This module contains an abstraction of the sidebar on the map page */
import { Page, Locator, expect } from '@playwright/test';
import { HDOTAssetsByTypeWidget } from './hdotAssetsByTypeWidget';
import { CategoriesVerticalBar } from './categoriesVerticalBar';
import { ThematicIndicesFacilitiesAndStructuresWidget } from './facilitiesAndStructuresWidget';

export class MapPageSideBar {
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

    async clickLogo() {
        await this.logo.click();
        await expect(this.informationTab).toBeHidden();
        await expect(this.page).toHaveURL(/#back-to-top-anchor/);
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
