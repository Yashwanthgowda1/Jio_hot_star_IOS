import type { Page, Response } from "@playwright/test";
import { BasePage } from "./BasePage";

export class HomePage extends BasePage {
  constructor(readonly page: Page) {
    super(page);
  }

  async open(): Promise<void> {
    await this.navigate("/");
  }

}
