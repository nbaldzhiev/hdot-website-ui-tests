import { Page, Locator, expect } from "@playwright/test";

export class MoreLayersConfig {
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