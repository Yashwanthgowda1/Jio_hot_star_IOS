import { test } from "../src/fixtures/test.fixture";

test("searches the Leave List by employee name", async ({ authenticatedHomePage, homePage }) => {
  await authenticatedHomePage.open_leave_list();
  await authenticatedHomePage.selectLeaveDate("From Date", "February", 2025, 17);
  await authenticatedHomePage.selectLeaveDate("To Date", "February", 2025, 18);
  await authenticatedHomePage.search_leave_by_employee_name("Ranga Akunuri");
});

test.only("clcik on new episodes and for you and verify the new episodes are displayed", async ({homePage})=>{
  await homePage.open();
  await homePage.getNewHotstarEpisodesOrForYou();
  await homePage.get_all_new_epsoides_or_for_you();
  } )