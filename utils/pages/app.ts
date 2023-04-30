/** This module contains an abstraction of the UI part of the test app */
import { Page } from '@playwright/test';
import { HomePage } from './home';
import { MapPage } from './map';

export class AppUI {
    readonly page: Page;
    readonly homePage: HomePage;
    readonly mapPage: MapPage;

    constructor(page: Page) {
        this.page = page;
        this.homePage = new HomePage(page);
        this.mapPage = new MapPage(page);
    }
}
