import { Page, test } from "@playwright/test";
import { BasePage } from "./BasePage";

const allcontnetincategory= new Map<string, string[]>();

export class CategoryPage extends BasePage {
// declarization of the locators
private readonly allcategorysection=this.page.getByRole("heading", {level:2, exact:true, includeHidden:true});
private readonly allviewsectionsincategory:string="xpath=./ancestor::div[@navigationtype='DEFAULT']/following-sibling::div[@data-name='tray-header-expand-cta']//button[@data-testid='pill-View All']"
// private readonly allviewsectionsincategorylocator=this.page.locator("[class~='-xcjfqjliWAYyIAfmvHKm'] [data-testid='link']"); no use
private readonly navigationBackdrop=this.page.getByTestId("backdropWidth").first();

    constructor(page:Page){
        // initilazation of the base page class
        super(page);
    }

 async getallheadersincategorysections(sectionselect: string): Promise<void> {
  await test.step("verify each content in the category section and click view all", async () => {
    const numberOfHeaders = await this.allcategorysection.count();
    allcontnetincategory.clear();

    for (let i = 0; i < numberOfHeaders; i++) {
      const actualHeader = this.allcategorysection.nth(i);
      const headerText = (await actualHeader.innerText()).trim();
      allcontnetincategory.set(headerText, []);
    }

    for (let i = 0; i < numberOfHeaders; i++) {
      const actualHeader = this.allcategorysection.nth(i);
      const headerText = (await actualHeader.innerText()).trim();

      if (headerText === sectionselect.trim()) {
        const viewAllSection = actualHeader
          .locator(this.allviewsectionsincategory)
          .first();

        if (await this.isVisible(this.navigationBackdrop)) {
          await this.navigationBackdrop.click();
          await this.navigationBackdrop.waitFor({ state: "hidden" });
        }

        await this.clickElement(viewAllSection);
        break;
      }
    }
  });
}


}