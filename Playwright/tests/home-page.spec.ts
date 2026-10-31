import { test } from "../src/fixtures/test.fixture";

test("searches the Leave List by employee name", async ({ homePage }) => {
  await homePage.open();
  await homePage.click_enter_user_cred();
  await homePage.verify_banner_toggle_expanded();
  await homePage.open_leave_list();
  await homePage.selectLeaveDate("From Date", "February", 2025, 17);
  await homePage.selectLeaveDate("To Date", "February", 2025, 18);
  await homePage.search_leave_by_employee_name("Ranga Akunuri");
});
