import { expect, test } from "../src/fixtures/test.fixture";

test("home page opens successfully", async ({ homePage }) => {
  const response = await homePage.open();

  expect(response, "The home page should return an HTTP response").not.toBeNull();
  expect(response?.ok(), "The home page should return a successful HTTP status").toBe(
    true,
  );
  expect(homePage.getUrl()).toContain("/");
});
