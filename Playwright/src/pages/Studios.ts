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
      await this.scrollElementVisibleapproch(
        this.page.locator(this.headerSelector).first(),
      );

      const franchiseCount = await this.availableStudioFranchises.count();
      this.studioFranchiseNames.length = 0;

      for (let index = 0; index < franchiseCount; index++) {
        const franchiseName = await this.getattributevalue(
          this.availableStudioFranchises.nth(index),
          "alt",
        );
        this.studioFranchiseNames.push(franchiseName);
      }

      await test.info().attach("available-studio-franchises.json", {
        body: JSON.stringify(this.studioFranchiseNames, null, 2),
        contentType: "application/json",
      });

      await test.step("Select the HBO Max franchise", async () => {
        for (let index = 0; index < franchiseCount; index++) {
          const franchiseImage = this.availableStudioFranchises.nth(index);
          const franchiseName = this.studioFranchiseNames[index];

          if (franchiseName.trim().includes("HBO Max")) {
            await this.clickElement(franchiseImage);
            return;
          }
        }

        throw new Error("HBO Max franchise was not found");
      });
    });
  }

  async collectHboMaxSectionContents(): Promise<void> {
    await test.step("Collect contents for each HBO Max section", async () => {
      this.franchiseContents.clear();
      const sectionCount = await this.franchiseSectionContainers.count();

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

        if ((await viewAllButton.count()) === 0) {
          continue;
        }

        await test.step(`Collect "${categoryName}" contents`, async () => {
          await this.clickElement(viewAllButton);
          await expect(this.viewAllContentImages.first()).toBeVisible();

          const contentCount = await this.viewAllContentImages.count();
          const categoryContents = this.franchiseContents.get(categoryName);

          for (let contentIndex = 0; contentIndex < contentCount; contentIndex++) {
            const contentName = await this.getattributevalue(
              this.viewAllContentImages.nth(contentIndex),
              "alt",
            );
            categoryContents?.push(contentName);
          }

          await this.navigatebackonce();
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
