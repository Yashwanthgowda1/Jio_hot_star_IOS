
import { expect, test } from "../src/fixtures/test.fixture";

test.describe("SCRUM-20: Search with Suggestions", () => {

  test.beforeEach(async ({ searchPage }) => {
    await searchPage.open();
  });

  test.only("should display popular and partial-title suggestions", async ({searchPage,page,}) => {
    await searchPage.focusSearch();
    await expect(searchPage.searchBox).toBeFocused();
    await expect(searchPage.popularSearchesHeading).toBeVisible();

    for (const term of ["In", "Inc", "Ince"]) {
      await searchPage.enterSearchTerm(term);

      await expect(searchPage.searchBox).toContainText(term);
      console.log(`Searching for term: ${term}`);
      await expect(page).toHaveURL(
        new RegExp(`search_query=${term}`, "i"),
      );
    }

    await expect(searchPage.inceptionResult).toBeVisible();
  });

  test("should display the Inception top result", async ({
    searchPage,
    page,
  }) => {
    await searchPage.enterSearchTerm("Inception");

    await expect(page).toHaveURL(/search_query=Inception/i);
    await expect(searchPage.topResultHeading).toBeVisible();
    await expect(searchPage.inceptionResult).toBeVisible();
  });

  test("should restore popular searches after clearing", async ({
    searchPage,
  }) => {
    await searchPage.enterSearchTerm("Inception");

    await expect(searchPage.inceptionResult).toBeVisible();

    await searchPage.clearSearch();

    await expect(searchPage.searchBox).toHaveValue("");
    await expect(searchPage.popularSearchesHeading).toBeVisible();
  });
});
