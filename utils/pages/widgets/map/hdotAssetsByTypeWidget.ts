/**
 * This module contains an abstraction of the HDOT Assets By Type widget part of the side bar on the map page
 * when the HDOT Projects category is selected
 */
import { Page, Locator, expect } from '@playwright/test';

export class HDOTAssetsByTypeWidget {
    readonly title: Locator;
    readonly bridgeType: Locator;
    readonly roadwayType: Locator;
    readonly culvertType: Locator;
    readonly tunnelType: Locator;
    readonly loader: Locator;

    constructor(page: Page) {
        const selector = '[aria-label="HDOT Assets by Type"] div.MuiGrid-item > div.MuiGrid-spacing-xs-1';
        this.title = page.locator('h6[title="HDOT Assets by Type"]');
        this.bridgeType = page.locator(`${selector}:first-child`);
        this.roadwayType = page.locator(`${selector}:nth-child(2)`);
        this.culvertType = page.locator(`${selector}:nth-child(3)`);
        this.tunnelType = page.locator(`${selector}:last-child`);
    }

    async waitUntilTypesHaveLoaded() {
        for (const el of [this.bridgeType, this.roadwayType, this.culvertType, this.tunnelType]) {
            await expect(el.locator('span:not([class*="MuiSkeleton-wave"])')).toBeVisible();
            await el.locator('span:not([class*="MuiSkeleton-wave"])').textContent().then((val) => {
                expect(parseInt(val!)).toBeGreaterThan(1);
            })
        }
    }
}
