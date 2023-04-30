import { Page, Locator, expect } from "@playwright/test";


export class ThematicIndicesFacilitiesAndStructuresWidget {
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