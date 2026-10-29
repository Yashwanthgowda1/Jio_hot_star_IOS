import type { Locator, Page } from "@playwright/test";
import { BasePage } from "./BasePage";

export class SearchPage extends BasePage {
  readonly searchBox: Locator;
  readonly popularSearchesHeading: Locator;
  readonly topResultHeading: Locator;
  readonly inceptionResult: Locator;
  private readonly clearButton: Locator;
  private readonly searchTab: Locator;

  constructor(readonly page: Page) {
    super(page);

    this.searchBox = page.getByRole("textbox", {
      name: "Movies, shows and more",
    });
    this.popularSearchesHeading = page.getByRole("heading", {
      name: "Popular Searches",
    });
    this.topResultHeading = page.getByRole("heading", {
      name: "TOP RESULT",
    });
    this.inceptionResult = page
      .getByText("Inception", { exact: true })
      .first();
    this.clearButton = page.getByTestId("input-clear-option");
    this.searchTab = page.getByRole("tab", { name: "Search" });
  }

  async open(): Promise<void> {
    await this.navigate("/");
    await this.searchTab.click();
  }

  async enterSearchTerm(term: string): Promise<void> {
    await this.searchBox.fill(term);
  }

  async focusSearch(): Promise<void> {
    await this.searchBox.click({force:true});
  }

  async clearSearch(): Promise<void> {
    await this.clearButton.click();
  }
}
