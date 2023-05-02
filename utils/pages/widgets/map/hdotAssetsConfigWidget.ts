/**
 * This module contains an abstraction of the HDOT Assets widget present on the map page
 */
import { Page, Locator, expect } from '@playwright/test';

export class HDOTAssetsConfig {
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

    /** Expands the menu by clicking on the HDOT Assets button */
    async expand() {
        await this.page.keyboard.press('Escape');
        await expect(this.popup).toBeHidden();
        // use the Unselect all button as means to verify popup is visible or not
        await this.unselectAllBtn.isVisible().then(async (state) => {
            if (!state) {
                await this.btn.click();
            }
        });
        await expect(this.unselectAllBtn).toBeVisible();
        // Wait untill all toggles are enabled as a way to know that the popup has fully loaded
        await expect(this.popup.locator('span.MuiIconButton-root[aria-disabled="true"]')).toHaveCount(0, {
            timeout: 30000,
        });
    }

    /** Clicks on the Unselect All button in the expanded menu */
    async unselectAll() {
        await this.expand();
        const classVal = await this.unselectAllBtn.getAttribute('class');
        if (!classVal?.includes('Mui-disabled')) {
            await this.unselectAllBtn.click();
        }
        await expect(this.unselectAllBtn).toHaveClass(/Mui-disabled/);
        await expect(this.selectedMsg).toContainText(/0 selected/);
    }
}
