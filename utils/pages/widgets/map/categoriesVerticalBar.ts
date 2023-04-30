/** This module contains an abstraction of the categories vertical bar widget part of the side bar on the map page */
import { Page, Locator, expect } from "@playwright/test";

export class CategoriesVerticalBar {
    readonly page: Page;
    readonly thematicIndicesBtn: Locator;

    constructor(page: Page) {
        this.page = page;
        this.thematicIndicesBtn = page.locator('a[aria-label="Thematic Indices"]');
    }

    /** Opens the Thematic Indices category */
    async openThematicIndices() {
        await this.page.keyboard.press('Escape');
        const classVal = await this.thematicIndicesBtn.getAttribute('class');
        if (!classVal?.includes('Mui-selected')) {
            this.thematicIndicesBtn.click();
        }
        await expect(this.thematicIndicesBtn).toHaveClass(/Mui-selected/);
    }
}