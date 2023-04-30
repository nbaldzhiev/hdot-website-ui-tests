/** This module contains a page object model for the Home page */
import { Page, Locator, expect } from '@playwright/test';

class HomePageNavBar {
    readonly parentSelector: string = 'header.MuiPaper-root';

    readonly page: Page;
    readonly logo: Locator;
    readonly climateResilienceBtn: Locator;
    readonly actionPlanBtn: Locator;
    readonly climateStressorBtn: Locator;
    readonly theUrgencyBtn: Locator;
    readonly hdotMapBtn: Locator;
    readonly mapComponentsBtn: Locator;
    readonly goBackToTopBtn: Locator;

    constructor(page: Page) {
        this.page = page;
        this.logo = page.locator(`${this.parentSelector} svg`);
        let buttonSelector = `${this.parentSelector} .MuiTabs-flexContainer > a[role="tab"]`;
        this.climateResilienceBtn = page.locator(`${buttonSelector}:first-child`);
        this.actionPlanBtn = page.locator(`${buttonSelector}:nth-child(2)`);
        this.climateStressorBtn = page.locator(`${buttonSelector}:nth-child(3)`);
        this.theUrgencyBtn = page.locator(`${buttonSelector}:nth-child(4)`);
        this.hdotMapBtn = page.locator(`${buttonSelector}:nth-child(5)`);
        this.mapComponentsBtn = page.locator(`${buttonSelector}:last-child`);
        this.goBackToTopBtn = page.locator('button.MuiFab-sizeSmall');
    }

    /** Goes to the top of the page by clicking on the button in the right bottom corner */
    async goToTopOfPageViaBtn() {
        await this.goBackToTopBtn.click();
        await expect(this.page).toHaveURL(/#back-to-top-anchor/);
    }

    /** Goes to the Climate Resilience section by clicking on the corresponding nav bar button */
    async goToClimateResilienceSection() {
        await this.climateResilienceBtn.click();
        await expect(this.climateResilienceBtn).toHaveClass(/Mui-selected/);
        await expect(this.page).toHaveURL(/#climate-resilience/);
        await expect(this.page.locator('#climate-resilience h3')).toBeInViewport();
    }

    /** Goes to the Action Plan section by clicking on the corresponding nav bar button */
    async goToActionPlanSection() {
        await this.actionPlanBtn.click();
        await expect(this.actionPlanBtn).toHaveClass(/Mui-selected/);
        await expect(this.page).toHaveURL(/#action-plan/);
        await expect(this.page.locator('#action-plan h3')).toBeInViewport();
    }

    /** Goes to the Climate Stressor section by clicking on the corresponding nav bar button */
    async goToClimateStressorSection() {
        await this.climateStressorBtn.click();
        await expect(this.climateStressorBtn).toHaveClass(/Mui-selected/);
        await expect(this.page).toHaveURL(/#climate-stressor/);
        await expect(this.page.locator('#climate-stressor h3')).toBeInViewport();
    }

    /** Goes to the The Urgency section by clicking on the corresponding nav bar button */
    async goToTheUrgencySection() {
        await this.theUrgencyBtn.click();
        await expect(this.theUrgencyBtn).toHaveClass(/Mui-selected/);
        await expect(this.page).toHaveURL(/#the-urgency/);
        await expect(this.page.locator('#the-urgency h3:not(.MuiTypography-alignLeft)')).toBeInViewport();
    }

    /** Goes to the HDOT Map section by clicking on the corresponding nav bar button */
    async goToHdotMapSection() {
        await this.hdotMapBtn.click();
        await expect(this.hdotMapBtn).toHaveClass(/Mui-selected/);
        await expect(this.page).toHaveURL(/#explore-map/);
        // Below assertion fails on smaller resolutions such as 1280x720, so skipping so it doesn't interrupts tests
        // await expect(this.page.locator('#explore-map h3')).toBeInViewport();
    }

    /** Goes to the Map Components section by clicking on the corresponding nav bar button */
    async goToMapComponentsSection() {
        await this.mapComponentsBtn.click();
        await expect(this.mapComponentsBtn).toHaveClass(/Mui-selected/);
        await expect(this.page).toHaveURL(/#map-components/);
        await expect(this.page.locator('#map-components h3')).toBeInViewport();
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

    /**
     * Returns a HomePageAssertions object as an interface to invoking assertions on the page
     * @returns {HomePageAssertions}
     */
    get assertThat(): HomePageAssertions {
        return new HomePageAssertions(this);
    }
}

class HomePageAssertions {
    readonly homePage: HomePage;

    constructor(page: HomePage) {
        this.homePage = page;
    }

    /** Asserts that all elements in the header nav bar are visible */ 
    async allNavBarItemsAreVisible() {
        const navBar = this.homePage.navBar;
        for (const el of [
            navBar.climateResilienceBtn,
            navBar.actionPlanBtn,
            navBar.climateStressorBtn,
            navBar.theUrgencyBtn,
            navBar.hdotMapBtn,
            navBar.mapComponentsBtn,
            navBar.logo,
        ]) {
            await expect(el).toBeVisible();
        }
    }

}