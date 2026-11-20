import { Page, test, expect } from "@playwright/test";
import { BasePage } from "./BasePage";

export class StudiosPage extends BasePage {
  private readonly headerSelector = "h2";
  private readonly hboMaxLogo = this.page.getByAltText("HBO Max");
  private readonly availableStudioFranchises = this.page.locator(
    "[class*='_1OnAL0dm5hDcMT-MXdQjZp'] img",
  );
  private readonly openedFranchiseRails = this.page.locator(
    "[class*='_2f8mniB0Pr9YbQKqdtgaix w-3/5'] img",
  );
  private readonly franchiseSectionContainers = this.page.locator(
    "[class^='_1pNtmFjKFmfjgKkfX1EO87']",
  );

  private readonly categoryHeaderSelector =
    "[class*='_2KvYrW83MAqzJ5YSbD2rZ4 flex']>div";
    
  private readonly viewAllButtonSelector =
    "[class*='_2KvYrW83MAqzJ5YSbD2rZ4 flex'] [data-name='tray-header-expand-cta']";
  private readonly viewAllContentImages = this.page.locator(
    "[class*='_24m1gJkwkUWDfPoo_x2l9W'] img",
  );
  private readonly studioFranchiseNames: string[] = [];
  private readonly franchiseContents = new Map<string, string[]>();

  constructor(page: Page) {
    super(page);
  }

 
  async selectHboMaxFranchise(): Promise<void> {
    await test.step("Open the HBO Max studio page", async () => {
      await this.clickElement(this.hboMaxLogo);
      await expect(this.page).toHaveURL(/\/studios\/hbo_max\//);
      await expect(this.openedFranchiseRails.first()).toBeVisible();

      await test.step("Open the HBO franchise", async () => {
        const hboLink = this.page.getByRole("link", {
          name: /^HBO,CHANNEL$/,
          exact: true,
        });
        await expect(hboLink).toBeVisible();
        await this.clickElement(hboLink);
        await expect(this.page).toHaveURL(/\/studios\/hbo\//);
      });
    });
  }


   async collectHboMaxSectionContents(): Promise<void> {
    await test.step("Collect contents for each HBO Max section", async () => {
      this.franchiseContents.clear();
      const sectionCount = await this.franchiseSectionContainers.count();
      const hboPageUrl = this.getcurrenturl();
      console.log(`now it enter to the hbo page and all farncahiescounts ${sectionCount}`)

      for (let sectionIndex = 0; sectionIndex < sectionCount; sectionIndex++) {
        const section = this.franchiseSectionContainers.nth(sectionIndex);
        const categoryHeading = section
          .locator(this.categoryHeaderSelector)
          .locator("h2")
          .first();
        const categoryName = (await this.getText(categoryHeading)).trim();


        if (!this.franchiseContents.has(categoryName)) {
          this.franchiseContents.set(categoryName, []);
        }

        const viewAllButton = section
          .locator(this.viewAllButtonSelector)
          .first();

        await test.step(`Collect "${categoryName}" contents`, async () => {
          if (
            (await viewAllButton.count()) > 0 &&
            (await viewAllButton.isVisible())
          ) {
            await this.clickElement(viewAllButton);
          } else {
            const sectionLink = categoryHeading.locator("xpath=ancestor::a");
            await expect(sectionLink).toBeVisible();
            await this.clickElement(sectionLink);
          }

          await expect(this.viewAllContentImages.first()).toHaveAttribute("alt", /.+/);

          const eachaltvalueslist=await this.viewAllContentImages.evaluateAll(el => el.map(eachtextalt=>eachtextalt.getAttribute('alt')?.trim() ?? ""));
          const actuallyexistcontnet:string[]=eachaltvalueslist.filter(filetrouttext=> filetrouttext?.length>0)
          const categoryContents = this.franchiseContents.get(categoryName);

         categoryContents?.push(...actuallyexistcontnet);
          
          console.log("now done with collect the contnetindex values itarations ")

          await this.page.goto(hboPageUrl, { waitUntil: "domcontentloaded" });
          await expect(this.page).toHaveURL(hboPageUrl);
          await expect(
            this.franchiseSectionContainers.nth(sectionIndex),
          ).toBeVisible();
        });
      }

      await test.info().attach("hbo-max-section-contents.json", {
        body: JSON.stringify(
          Object.fromEntries(this.franchiseContents),
          null,
          2,
        ),
        contentType: "application/json",
      });
    });
  }
}