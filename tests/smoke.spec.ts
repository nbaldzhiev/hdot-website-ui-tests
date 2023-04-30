import { test } from "./fixture-test";

test.describe('Smoke', () => {
    test.setTimeout(60000);

    test('Should be able to open the Map page from the Home page', async ({ appUI }) => {
        await appUI.homePage.openMapViaTopSectionExploreMapBtn();
        await appUI.mapPage.assertThat.mapIsVisible();
        await appUI.mapPage.assertThat.titleSectionIsCorrect('Introduction');
        for (
            const p of [
                { index: 1, text: 'The State Highway System provides mobility for over 1.4 million Hawai' },
                { index: 2, text: 'The segments of the State Highway System that experience the highest' },
                { index: 3, text: 'Various climate hazards can impact this system by rendering infrastructure' },
            ]
        ) {
            await appUI.mapPage.assertThat.paragraphTextContains({ paragraphIndex: p.index, text: p.text });
        }
        await appUI.mapPage.assertThat.hdotAssetsByTypeWidgetIsVisible();
    })

    test('Should be able to toggle Facilities and Structure layer', async ({ appUI }) => {
        await appUI.homePage.openMapViaTopSectionExploreMapBtn();
        await appUI.mapPage.assertThat.mapIsVisible();
        await appUI.mapPage.moreLayersConfig.toggleFacilitiesAndStructures();
        await appUI.mapPage.hdotAssetsConfig.unselectAll();
        await appUI.mapPage.sidebar.categoriesVerticalBar.openThematicIndices();
        await appUI.mapPage.sidebar.goToInsightsTab();
        await appUI.mapPage.assertThat.facilitiesAndStructuresWidgetIsVisibleWithValues();
        await appUI.mapPage.sidebar.facilitiesAndStructuresWidget.selectPreSchoolType();
    })

});