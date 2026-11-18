import {test} from '../src/fixtures/test.fixture';

test.describe("epic: SCRUM-20: Studios", async()=>{
test.only("Verify the Studios section and placement of sections and verify the contents of the studios and Verify each rail of the Studios and the contents of each rail section",async ({homePage, categoryPage, studioPage}) => {
    await homePage.open();
    await homePage.navigate_to_category_page();
    await categoryPage.getallheadersincategorysections("Studios");
    await studioPage.selectHboMaxFranchise();
    await studioPage.collectHboMaxSectionContents();

})


// test("Verify the content loading when the network is slow and verify the loading of the Studio contents again", async () => {

// })




})