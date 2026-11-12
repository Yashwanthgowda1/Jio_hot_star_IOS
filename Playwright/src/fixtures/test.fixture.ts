import { test as base, expect } from "@playwright/test";
import { HomePage } from "../pages/home.page";
import { SearchPage } from "../pages/search.page";

interface TestFixtures {
  homePage: HomePage;
  searchPage: SearchPage;
  authenticatedHomePage: HomePage;
}

export const test = base.extend<TestFixtures>({
  
  authenticatedHomePage: async ({ homePage }, use) => {
    await homePage.open();
    await homePage.click_enter_user_cred();
    await homePage.verify_banner_toggle_expanded();
    await use(homePage);
  },

  homePage: async ({ page }, use) => {
    await use(new HomePage(page));
  },

  searchPage: async ({ authenticatedHomePage, page }, use) => {
    await use(new SearchPage(page));
  },
});

export { expect };
