import { test } from './fixture-test';

test.describe('Smoke', () => {
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
