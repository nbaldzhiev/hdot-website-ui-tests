/** 
 * This module contains an abstraction of the HDOT Assets By Type widget part of the side bar on the map page 
 * when the HDOT Projects category is selected
 */
import { Page, Locator } from "@playwright/test";

export class HDOTAssetsByTypeWidget {
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