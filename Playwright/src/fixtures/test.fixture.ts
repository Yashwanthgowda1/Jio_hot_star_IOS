import { test as base, expect } from "@playwright/test";
import { HomePage } from "../pages/home.page";
import { SearchPage } from "../pages/search.page";
import { CategoryPage } from "../pages/category";
import { StudiosPage } from "../pages/Studios";

interface TestFixtures {
  homePage: HomePage;
  searchPage: SearchPage;
  categoryPage: CategoryPage;
  studioPage: StudiosPage;
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

  categoryPage: async ({ page }, use) => {
    await use(new CategoryPage(page));
  },
  studioPage: async ({ page }, use) => {
    await use(new StudiosPage(page));
  },

  
});

export { expect };
