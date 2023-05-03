import { test, expect } from './fixture-test';

test.describe('E2E', () => {
    // Increasing the global test timeout due to the map loading slowly
    test.setTimeout(180000);

    test('Should be able to open the Map page from the Home page', async ({ appUI }) => {
        await appUI.homePage.openMapViaTopSectionExploreMapBtn();
        await appUI.mapPage.assertThat.mapIsVisible();
        await appUI.mapPage.waitUntilMapHasLoaded();
        await appUI.mapPage.sidebar.hdotAssetsByTypeWidget.waitUntilTypesHaveLoaded();
        await appUI.mapPage.assertThat.titleSectionIsCorrect('Introduction');
        for (const p of [
            { index: 1, text: 'The State Highway System provides mobility for over 1.4 million Hawai' },
            { index: 2, text: 'The segments of the State Highway System that experience the highest' },
            { index: 3, text: 'Various climate hazards can impact this system by rendering infrastructure' },
        ]) {
            await appUI.mapPage.assertThat.paragraphTextContains({ paragraphIndex: p.index, text: p.text });
        }
    });

    ['assets', 'hazards', 'index', 'others'].forEach((datasetName) => {
        test(`Should be able to see the map without the ${datasetName} dataset`, async ({ appUI }) => {
            await appUI.mapPage.modifyDatasetsResponse(datasetName);
            await appUI.homePage.openMapViaTopSectionExploreMapBtn();
            await appUI.mapPage.assertThat.titleSectionIsCorrect('Introduction');
            if (datasetName === 'assets') {
                await appUI.mapPage.assertThat.datasetBtnsAreVisible({
                    assets: false, hazards: true, indices: true, others: true
                });
            } else if (datasetName === 'hazards') {
                await appUI.mapPage.assertThat.datasetBtnsAreVisible({
                    assets: true, hazards: false, indices: true, others: true
                });
            } else if (datasetName === 'index') {
                await appUI.mapPage.assertThat.datasetBtnsAreVisible({
                    assets: true, hazards: true, indices: false, others: true
                });
            } else if (datasetName === 'others') {
                await appUI.mapPage.assertThat.datasetBtnsAreVisible({
                    assets: true, hazards: true, indices: true, others: false
                });
            }
        });
    });

    test('Should be able to toggle Facilities and Structure layer', async ({ appUI }) => {
        // **NOTE** The coordinates below have been implemented against a browser resolution of 1280x720 (default)
        // so they would need to be adjusted if testing against a different resolution or the page structure changes
        // TODO: Find a more reusable and robust solution to interacting with the objects within the canvas map
        const mapZoomInCoordinatesHonolulu = [
            { x: 259, y: 110 },
            { x: 259, y: 110 },
            { x: 459, y: 110 },
        ];
        const mapObjectHoverCoords = { x: 750, y: 640 };
        const mapObjectHoverContent = 'Name: Hawaii Kai Church Early Learning Center (Pre-School)';

        await appUI.homePage.openMapViaTopSectionExploreMapBtn();
        await appUI.mapPage.assertThat.mapIsVisible();
        await appUI.mapPage.waitUntilMapHasLoaded();
        await appUI.mapPage.sidebar.hdotAssetsByTypeWidget.waitUntilTypesHaveLoaded();
        await appUI.mapPage.assertThat.titleSectionIsCorrect('Introduction');
        await appUI.mapPage.moreLayersConfig.toggleFacilitiesAndStructures();
        await appUI.mapPage.hdotAssetsConfig.unselectAll();
        await appUI.mapPage.sidebar.categoriesVerticalBar.openThematicIndices();
        await appUI.mapPage.sidebar.goToInsightsTab();
        await appUI.mapPage.assertThat.facilitiesAndStructuresWidgetIsVisibleWithValues();

        // Store the Facilities and Structures widget values so that they can be compared later
        const facilitiesAndStructures = appUI.mapPage.sidebar.facilitiesAndStructuresWidget;
        const preSchoolValue = await facilitiesAndStructures.getPreSchoolValue();
        const fireStationValue = await facilitiesAndStructures.getFireStationValue();
        const policeStationValue = await facilitiesAndStructures.getPoliceStationValue();
        // Zoom in on the Hololulu island
        await appUI.mapPage.zoomInMapByCoordinates(mapZoomInCoordinatesHonolulu);
        await appUI.mapPage.waitUntilMapHasLoaded();
        await appUI.mapPage.hoverMapObjectByCoordinates(mapObjectHoverCoords.x, mapObjectHoverCoords.y);
        await appUI.mapPage.assertThat.mapObjectHoverContentIsCorrect(mapObjectHoverContent);

        // Assert that the zoomed in values are less than the values when the entire map is viewed
        expect(preSchoolValue).toBeGreaterThan(await facilitiesAndStructures.getPreSchoolValue());
        expect(fireStationValue).toBeGreaterThan(await facilitiesAndStructures.getFireStationValue());
        expect(policeStationValue).toBeGreaterThan(await facilitiesAndStructures.getPoliceStationValue());

        await appUI.mapPage.sidebar.facilitiesAndStructuresWidget.selectPreSchoolType();
    });

    test('Should be able to navigate to each section on the Home page', async ({ appUI }) => {
        await appUI.homePage.assertThat.allNavBarItemsAreVisible();

        await appUI.homePage.navBar.goToClimateResilienceSection();
        await appUI.homePage.navBar.goToTopOfPageViaBtn();
        await appUI.homePage.navBar.goToActionPlanSection();
        await appUI.homePage.navBar.goToTopOfPageViaBtn();
        await appUI.homePage.navBar.goToClimateStressorSection();
        await appUI.homePage.navBar.goToTopOfPageViaBtn();
        await appUI.homePage.navBar.goToTheUrgencySection();
        await appUI.homePage.navBar.goToTopOfPageViaBtn();
        await appUI.homePage.navBar.goToHdotMapSection();
        await appUI.homePage.navBar.goToTopOfPageViaBtn();
        await appUI.homePage.navBar.goToMapComponentsSection();
        await appUI.homePage.navBar.goToTopOfPageViaBtn();

        await appUI.homePage.navBar.goToClimateResilienceSection();
        await appUI.homePage.navBar.goToActionPlanSection();
        await appUI.homePage.navBar.goToHdotMapSection();

        await appUI.homePage.openMapViaTopSectionExploreMapBtn();
        await appUI.mapPage.sidebar.clickLogo();
        await appUI.homePage.assertThat.allNavBarItemsAreVisible();

        await appUI.homePage.openMapViaTopSectionExploreMapBtn();
        await appUI.mapPage.assertThat.mapIsVisible();
        await appUI.mapPage.zoomIn();
        await appUI.mapPage.zoomOut();
    });
});
