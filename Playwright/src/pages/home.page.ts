import { expect, test, type Page, type Locator } from "@playwright/test";
import { BasePage } from "./BasePage";
import { FileReader } from "../utils/FileReader";

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
] as const;

type MonthName = (typeof MONTH_NAMES)[number];
type LeaveDateField = "From Date" | "To Date";

export class HomePage extends BasePage {
  private readonly Loginpage:Locator=this.page.getByPlaceholder("Username");
  private readonly Passwordpage:Locator=this.page.getByPlaceholder("Password");
  private readonly Loginbutton:Locator=this.page.locator('button[type="submit"]');
  private readonly hoem_page_logo:Locator= this.page.locator("[alt='client brand banner']")
  private readonly banner_toggle=this.page.locator("[class='oxd-brand-banner']")
  private readonly expand_toggle=this.page.locator("button[class*='oxd-icon-button']>[class*='oxd-icon bi-chevron']")
  private readonly leave_module=this.page.locator("//span[text()='Leave']")
  private readonly leave_list= this.page.getByRole("link", { name: "Leave List" });
  private readonly calendar=this.page.locator(".oxd-calendar-wrapper");
  private readonly monthSelector=this.calendar.locator(".oxd-calendar-selector-month");
  private readonly yearSelector=this.calendar.locator(".oxd-calendar-selector-year");
  private readonly type_leave=this.page.locator("[class='oxd-select-dropdown --positon-bottom']")
  private readonly leave_condition="[class='oxd-select-option']"
  private readonly employeeName=this.page.getByPlaceholder("Type for hints...");
  private readonly leaveSearchButton=this.page.getByRole("button", { name: /Search/, exact: true });
  private readonly noResultsInfoPopup=this.page.locator(".oxd-toast-content--info").locator("[class*='oxd-toast-content-text']").nth(1)

  constructor(page: Page) {
    super(page);
  }

  async open(): Promise<void> {
    await test.step("Open login page", async () => {
      await this.navigate("/web/index.php/auth/login");
    });
  }
  async click_enter_user_cred(): Promise<void> {
    await test.step("Sign in with configured credentials", async () => {
      const {username, password } = FileReader.readCredentials();

      await test.step("Enter username", async () => {
        await this.fillInput(this.Loginpage, username);
      });
      await test.step("Enter password", async () => {
        await this.fillInput(this.Passwordpage, password);
      });
      await test.step("Submit login form", async () => {
        await this.clickElement(this.Loginbutton);
      });
      await test.step("Wait for home page banner", async () => {
        await this.hoem_page_logo.waitFor({ state: "visible" });
      });
    });

  }
  async verify_banner_toggle_expanded():Promise<void>{
    await test.step("Ensure navigation banner is expanded", async () => {
      const text_values=await this.banner_toggle.getAttribute("class");
      if(!text_values?.includes("toggled")){
        await this.clickElement(this.expand_toggle);
      }
    });

  }

  async open_leave_list(): Promise<void> {
    await this.navigate("/web/index.php/leave/viewLeaveList");
    await this.clickElement(this.page.locator("[class='oxd-table-filter-header']"))
  }

  async selectLeaveDate(
    field: LeaveDateField,
    month: MonthName,
    year: number,
    day: number,
  ): Promise<void> {
    if (!Number.isInteger(year) || !Number.isInteger(day) || day < 1 || day > 31) {
      throw new RangeError(`Invalid leave date: ${month} ${day}, ${year}`);
    }

    await test.step(`Select ${field}: ${month} ${day}, ${year}`, async () => {
      const dateField = this.page
        .locator(".oxd-input-group")
        .filter({ hasText: field })
        .getByPlaceholder("yyyy-dd-mm");
      if (!(await dateField.isVisible())) {
        await this.page.locator(".oxd-table-filter-header button").click();
      }
      await dateField.locator("xpath=..").locator(".oxd-date-input-icon").click();

      await this.monthSelector.first().click();
      await this.calendar
        .locator(".oxd-calendar-selector-month .oxd-calendar-dropdown--option")
        .getByText(month, { exact: true })
        .click();

      await this.yearSelector.click();
      const yearOption = this.calendar
        .locator(".oxd-calendar-selector-year .oxd-calendar-dropdown--option")
        .filter({ hasText: new RegExp(`^${year}$`) });
      if (await yearOption.count() !== 1) {
        throw new RangeError(`Year ${year} is not available in the leave date picker`);
      }
      await yearOption.click();

      const dayOption = this.calendar
        .locator(".oxd-calendar-dates-grid .oxd-calendar-date")
        .filter({ hasText: new RegExp(`^${day}$`) });
      if (await dayOption.count() !== 1) {
        throw new RangeError(`${month} ${day}, ${year} is not a valid date`);
      }
      await dayOption.click();
    });
  }
  async select_type_leave(){
    await test.step("type of ;evae taken slection " , async ()=>{
      await this.clickElement(this.type_leave);
      await this.clickElement(this.type_leave.locator(this.leave_condition).nth(4))
      const texts = await this.page.locator("[class*='oxd-multiselect-chips-selected']").first().innerText()
      console.log("the slected leave option is texts ", texts)
      
    
    })
    

  }

  async search_leave_by_employee_name(name: string): Promise<void> {
    await test.step(`Search leave records for ${name}`, async () => {
      if (!(await this.employeeName.isVisible())) {
        await this.page.locator(".oxd-table-filter-header button").click();
      }

      await this.employeeName.fill(name);
      await this.page.getByRole("option", { name, exact: true }).click();
      await this.leaveSearchButton.click();
      await this.page.locator("[aria-live='assertive']>[class='oxd-toast-start']").waitFor({ state: "visible" });

      if (await this.page.locator(".oxd-table-body .oxd-table-row").count() === 0) {
        await expect(this.noResultsInfoPopup.first()).toBeVisible();
        await expect(this.noResultsInfoPopup).toContainText("No Records Found");
      }
    });
  }
}
