/** This module contains a page object model for the Home page */
import { Page, Locator, expect } from '@playwright/test';

class HomePageNavBar {
    readonly parentSelector: string = 'header.MuiPaper-root';

    readonly logo: Locator;
    readonly climateResilienceBtn: Locator;
    readonly actionPlanBtn: Locator;
    readonly climateStressorBtn: Locator;
    readonly theUrgencyBtn: Locator;
    readonly hdotMapBtn: Locator;
    readonly mapComponentsBtn: Locator;

    constructor(page: Page) {
        this.logo = page.locator(`${this.parentSelector} svg`);
        let buttonSelector = `${this.parentSelector} .MuiTabs-flexContainer > a[role="tab"]`;
        this.climateResilienceBtn = page.locator(`${buttonSelector}:first-child`);
        this.actionPlanBtn = page.locator(`${buttonSelector}:nth-child(2)`);
        this.climateStressorBtn = page.locator(`${buttonSelector}:nth-child(3)`);
        this.theUrgencyBtn = page.locator(`${buttonSelector}:nth-child(4)`);
        this.hdotMapBtn = page.locator(`${buttonSelector}:nth-child(5)`);
        this.mapComponentsBtn = page.locator(`${buttonSelector}:last-child`);
    }

    /** Goes to the Climate Resilience section by clicking on the corresponding nav bar button */
    async goToClimateResilienceSection() {
        await this.climateResilienceBtn.click();
        await expect(this.climateResilienceBtn).toHaveClass('Mui-selected');
    }

    /** Goes to the Action Plan section by clicking on the corresponding nav bar button */
    async goToActionPlanSection() {
        await this.actionPlanBtn.click();
        await expect(this.actionPlanBtn).toHaveClass('Mui-selected');
    }

    /** Goes to the Climate Stressor section by clicking on the corresponding nav bar button */
    async goToClimateStressorSection() {
        await this.climateStressorBtn.click();
        await expect(this.climateStressorBtn).toHaveClass('Mui-selected');
    }

    /** Goes to the The Urgency section by clicking on the corresponding nav bar button */
    async goToTheUrgencySection() {
        await this.theUrgencyBtn.click();
        await expect(this.theUrgencyBtn).toHaveClass('Mui-selected');
    }

    /** Goes to the HDOT Map section by clicking on the corresponding nav bar button */
    async goToHdotMapSection() {
        await this.hdotMapBtn.click();
        await expect(this.hdotMapBtn).toHaveClass('Mui-selected');
    }

    /** Goes to the Map Components section by clicking on the corresponding nav bar button */
    async goToMapComponentsSection() {
        await this.mapComponentsBtn.click();
        await expect(this.mapComponentsBtn).toHaveClass('Mui-selected');
    }
}

/** This class defines an abstraction of the Home page */
export class HomePage {
    readonly page: Page;
    readonly navBar: HomePageNavBar;
    readonly topSectionExploreMapBtn: Locator;

    constructor(page: Page) {
        this.page = page;
        this.navBar = new HomePageNavBar(page);
        this.topSectionExploreMapBtn = page.locator('div#back-to-top-anchor a[href="/map/information/info"]');
    }

    async openMapViaTopSectionExploreMapBtn() {
        await this.topSectionExploreMapBtn.click();
        await expect(this.topSectionExploreMapBtn).toBeHidden();
    }
}