import { type Page, type Locator } from "@playwright/test";
import CommonUtili from "../utils/CommonUtili";

export type ActionType = "hover" | "click" | "doubleclick" | "rightclick";

export class BasePage {
  // intiliaze the page at constracter 
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
  getcurrenturl():string {
    return this.page.url();
  }

async current_height_window(): Promise<number> {
    return await this.page.evaluate(() => document.scrollingElement?.scrollTop ?? 0);
}

async scroll_page_once(): Promise<number> {
    return await this.page.evaluate(() => {
        const scrollingElement = document.scrollingElement;
        if (!scrollingElement) {
            throw new Error("Unable to find the document scrolling element");
        }
        scrollingElement.scrollTop = Math.min(
            scrollingElement.scrollTop + window.innerHeight,
            scrollingElement.scrollHeight,
        );
        return scrollingElement.scrollTop;
    });
}

}