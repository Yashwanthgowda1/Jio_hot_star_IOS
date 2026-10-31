import { type Page, type Locator } from "@playwright/test";
import CommonUtili from "../utils/CommonUtili";

export type ActionType = "hover" | "click" | "doubleclick" | "rightclick";

export class BasePage {
  constructor(protected page: Page) {}

  async navigate(url: string): Promise<void> {
    await this.page.goto(url);
  }

  async clickElement(locator: Locator): Promise<void> {
    await locator.click();
  }

  async fillInput(locator: Locator, value: string): Promise<void> {
    await locator.fill(value);
  }

  async getText(locator: Locator): Promise<string> {
    return await locator.innerText();
  }

  async isVisible(locator: Locator): Promise<boolean> {
    return await locator.isVisible();
  }
  async actions(locator: Locator, actiontype: ActionType = "hover"): Promise<void> {
    await CommonUtili.mouseactions(locator, actiontype);
  }

}