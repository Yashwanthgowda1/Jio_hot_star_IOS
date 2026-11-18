import { Page, Locator, test, expect } from "@playwright/test";
import { BasePage } from "./BasePage";

const allcontnetincategory= new Map<string, string[]>();

export class CategoryPage extends BasePage {
// declarization of the locators
private readonly allcategorysection=this.page.getByRole("heading", {level:2, exact:true, includeHidden:true});
private readonly allviewsectionsincategory:string="/ancestor::div[contains(@class,'_2KvYrW83MAqzJ5YSbD2rZ4')]/descendant::div[@data-name='tray-header-expand-cta']";
private readonly allviewsectionsincategorylocator=this.page.locator("[class~='-xcjfqjliWAYyIAfmvHKm'] [data-testid='link']");
private readonly verifyheader=this.page.getByRole("heading", {name:"Disney Plus", level:4, exact:true});


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

        await this.clickElement(viewAllSection);
        await expect(this.verifyheader).toContainText(sectionselect);
        break;
      }
    }
  });
}


}