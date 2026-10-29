import { test as base, expect } from "@playwright/test";
import { HomePage } from "../pages/home.page";
import { SearchPage } from "../pages/search.page";

interface TestFixtures {
  homePage: HomePage;
  searchPage: SearchPage;
}

export const test = base.extend<TestFixtures>({
  homePage: async ({ page }, use) => {
    await use(new HomePage(page));
  },
  searchPage: async ({ page }, use) => {
    await use(new SearchPage(page));
  },
});

export { expect };
