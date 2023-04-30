import { Page, Locator, expect } from "@playwright/test";

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