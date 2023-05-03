/** This module contains a page object model for the Map page */
import { Page, Locator, expect } from '@playwright/test';
import { MoreLayersConfig } from './widgets/map/moreLayersConfigWidget';
import { HDOTAssetsConfig } from './widgets/map/hdotAssetsConfigWidget';
import { MapPageSideBar } from './widgets/map/sidebar';

/** This class defines an abstraction of the Map page */
export class MapPage {
    readonly page: Page;
    readonly mapArea: Locator;
    readonly sidebar: MapPageSideBar;
    readonly moreLayersConfig: MoreLayersConfig;
    readonly hdotAssetsConfig: HDOTAssetsConfig;
    readonly hazardsBtn: Locator;
    readonly thematicIndicesBtn: Locator;
    readonly zoomOutBtn: Locator;
    readonly zoomInBtn: Locator;
    readonly zoomLevel: Locator;
    readonly objectHoverPopUpContent: Locator;

    constructor(page: Page) {
        this.page = page;
        this.mapArea = page.locator('canvas[aria-label="Map"]');
        this.sidebar = new MapPageSideBar(page);
        this.moreLayersConfig = new MoreLayersConfig(page);
        this.hdotAssetsConfig = new HDOTAssetsConfig(page);
        this.hazardsBtn = page.locator('button[aria-controls="simple-menu"] span', { hasText: 'Hazards' });
        this.thematicIndicesBtn = page.locator('button[aria-controls="simple-menu"] span', {
            hasText: 'Thematic Indices',
        });
        this.zoomOutBtn = page.locator('button[aria-label="Decrease zoom"]');
        this.zoomInBtn = page.locator('button[aria-label="Increase zoom"]');
        this.zoomLevel = page.locator('.MuiBox-root .MuiTypography-displayBlock');
        this.objectHoverPopUpContent = page.locator('#deckgl-wrapper .content span');
    }

    async zoomIn() {
        await this.zoomLevel.textContent().then(async (val) => {
            const levelAsInt = parseInt(val!);
            await this.zoomInBtn.click();
            await expect(this.zoomLevel).toHaveText((levelAsInt + 1).toString());
        });
    }

    async zoomOut() {
        await this.zoomLevel.textContent().then(async (val) => {
            const levelAsInt = parseInt(val!);
            await this.zoomOutBtn.click();
            await expect(this.zoomLevel).toHaveText((levelAsInt - 1).toString());
        });
    }

    /**
     * Zooms in on the map by using double clicks based on X and Y coordinates of the page
     * @param coordinates An array of objects containing properties 'x' and 'y', designating the coordinates to click
     * on. An array so that the user can provide multiple zoom ins in one call.
     */
    async zoomInMapByCoordinates(coordinates: { x: number; y: number }[]) {
        for (const coord of coordinates) {
            await this.mapArea.dblclick({ force: true, position: { x: coord.x, y: coord.y } });
        }
    }

    /**
     * Hovers over a given object on the map designated by its X and Y coordinates on the page
     * @param x The page X coordinate to hover at
     * @param y The page Y coordinate to hover at
     */
    async hoverMapObjectByCoordinates(x: number, y: number) {
        await this.mapArea.hover({ force: true, position: { x: x, y: y } });
    }

    /**
     * Waits for the map to load by waiting until no more API requests for /maps/hdot-public-app/tileset/ are made,
     * which happens when the map has finished loading all its data.
     * @param {number} loadTimeout The total timeout to wait for requests to stop coming in. In seconds. Defaults to 30.
     * @param {number} requestTimeout The total timeout for waiting for a single request. If this timeout is reached,
     * then a request didn't arrive after this amount of time. In seconds. Defaults to 10.
     */
    async waitUntilMapHasLoaded(loadTimeout = 30, requestTimeout = 10) {
        let numOfRequests = 0;
        let finishedLoading = false;
        let nothingLoaded = false;
        for (let i = 0; i < loadTimeout * 2; i++) {
            await this.page
                .waitForRequest(/\/maps\/hdot-public-app\/tileset\//, {
                    timeout: requestTimeout * 1000,
                })
                .then(() => numOfRequests++)
                .catch(() => {
                    if (numOfRequests) {
                        // If waitForRequest timed out, but there were requests already, i.e. requests have stopped and
                        // map has *probably* loaded
                        finishedLoading = true;
                    } else if (!numOfRequests) {
                        // If waitForRequest timed out before any request is received, i.e. map didn't load at all
                        nothingLoaded = true;
                    }
                });
            if (finishedLoading || nothingLoaded) break;
            await this.page.waitForTimeout(500);
        }
        expect(nothingLoaded).toBeFalsy();
        expect(finishedLoading).toBeTruthy();
    }

    /**
     * Modifies the response of the /dataset/datasets.json GET request by deleting one of the dataset properties.
     * @param datasetName The dataset whose property to delete - 'assets' | 'hazards' | 'index' | 'others'
     */
    async modifyDatasetsResponse(datasetName: string) {
        await this.page.route('**/data/datasets.json', async (route) => {
            const response = await route.fetch();
            const body = await response.json();
            delete body['commons'][datasetName];
            route.fulfill({ json: body });
        });
    }

    /**
     * Returns a MapPageAssertions object as an interface to invoking assertions on the page
     * @returns {MapPageAssertions}
     */
    get assertThat(): MapPageAssertions {
        return new MapPageAssertions(this);
    }
}

class MapPageAssertions {
    readonly mapPage: MapPage;

    constructor(page: MapPage) {
        this.mapPage = page;
    }

    /** Asserts that the map is visible */
    async mapIsVisible() {
        await expect(this.mapPage.mapArea).toBeVisible();
    }

    /** Asserts that the title of the section in the sidebar is the expected one
     * @param {string} title The expected title
     */
    async titleSectionIsCorrect(title: string) {
        await expect(this.mapPage.sidebar.title).toHaveText(title);
    }

    /**
     * Asserts that the HDOT Assets button is visible or not
     * @param negate Whether or not to negate the statement, i.e. true would mean to assert button is not
     * visible
     */
    async hdotAssetsBtnIsVisible(negate = false) {
        if (!negate) {
            await expect(this.mapPage.hdotAssetsConfig.btn).toBeVisible();
        } else {
            await expect(this.mapPage.hdotAssetsConfig.btn).toBeHidden();
        }
    }

    /**
     * Asserts that the Hazards button is visible or not
     * @param negate Whether or not to negate the statement, i.e. true would mean to assert button is not
     * visible
     */
    async hazardsBtnIsVisible(negate = false) {
        if (!negate) {
            await expect(this.mapPage.hazardsBtn).toBeVisible();
        } else {
            await expect(this.mapPage.hazardsBtn).toBeHidden();
        }
    }

    /**
     * Asserts that the Thematic Indices button is visible or not
     * @param negate Whether or not to negate the statement, i.e. true would mean to assert button is not
     * visible
     */
    async thematicIndicesBtnIsVisible(negate = false) {
        if (!negate) {
            await expect(this.mapPage.thematicIndicesBtn).toBeVisible();
        } else {
            await expect(this.mapPage.thematicIndicesBtn).toBeHidden();
        }
    }

    /**
     * Asserts that the More Layers button is visible or not
     * @param negate Whether or not to negate the statement, i.e. true would mean to assert button is not
     * visible
     */
    async moreLayersBtnIsVisible(negate = false) {
        if (!negate) {
            await expect(this.mapPage.moreLayersConfig.btn).toBeVisible();
        } else {
            await expect(this.mapPage.moreLayersConfig.btn).toBeHidden();
        }
    }

    /**
     * Asserts that the dataset buttons are visible or not.
     * @param obj
     * @param obj.assets Whether or not the HDOT Assets button is expected to be visible or not
     * @param obj.hazards Whether or not the Hazards button is expected to be visible or not
     * @param obj.indices Whether or not the Thematic Indices button is expected to be visible or not
     * @param obj.others Whether or not the More Layers button is expected to be visible or not
     */
    async datasetBtnsAreVisible({
        assets,
        hazards,
        indices,
        others,
    }: {
        assets: boolean;
        hazards: boolean;
        indices: boolean;
        others: boolean;
    }) {
        await this.hdotAssetsBtnIsVisible(!assets);
        await this.hazardsBtnIsVisible(!hazards);
        await this.thematicIndicesBtnIsVisible(!indices);
        await this.moreLayersBtnIsVisible(!others);
    }

    /** Asserts that the title of the section in the sidebar is the expected one
     * @param {string} title The expected title
     */
    async paragraphTextContains({ paragraphIndex, text }: { paragraphIndex: number; text: string }) {
        await expect(this.mapPage.sidebar.textParagraphs.nth(paragraphIndex - 1)).toContainText(text);
    }

    /** Asserts that the Thematic Indices Facilities and Structures widget on the Insights sidebar tab is visible */
    async facilitiesAndStructuresWidgetIsVisibleWithValues() {
        const widget = this.mapPage.sidebar.facilitiesAndStructuresWidget;
        // TODO: What if some of the types doesn't have entries, should it be displayed in the widget?
        for (const el of [widget.preSchoolType, widget.fireStationType, widget.policeStationType]) {
            await el
                .locator('span:not([class])')
                .textContent()
                .then((val) => {
                    expect(parseInt(val!)).toBeGreaterThan(1);
                });
        }
    }

    /**
     * Asserts that the zoom level within the zoom widget is correct
     * @param {number} zoomLevel Expected zoom level
     */
    async zoomLevelIsCorrect(zoomLevel: number) {
        await expect(this.mapPage.zoomLevel).toHaveText(zoomLevel.toString());
    }

    /**
     * Asserts that the content of the popup available upon hovering on a map object is correct. This is not to be
     * mistaken with the dialog which apppears when clicking on a map object
     * @param content The expected content in the popup
     */
    async mapObjectHoverContentIsCorrect(content: string) {
        await expect(this.mapPage.objectHoverPopUpContent).toBeVisible();
        await expect(this.mapPage.objectHoverPopUpContent).toContainText(content);
    }
}
