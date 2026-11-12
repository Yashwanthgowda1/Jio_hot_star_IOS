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
  private readonly alt_movie_name_new_for_you="xpath=ancestor::article[@role='presentation']//img";
  private readonly new_episodes_or_for_you=this.page.locator("[class~='ON_IMAGE'][class~='TEXT_BADGE2']");
  private readonly get_new_on_hotstar=this.page.locator("//*[@title='New on JioHotstar' or text()='New on JioHotstar']");
  private readonly get_for_you_on_hotstar=this.page.locator("//*[text()='New on JioHotstar']");
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
      await this.navigate("/in/home");
    })
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

async getNewHotstarEpisodesOrForYou(): Promise<void> {
  await test.step("Click New on Hotstar and verify contents", async () => {

    const current_page_url =this.getcurrenturl();

    await this.clickElement(this.get_new_on_hotstar);

    // Wait until the new episodes content is visible
    await expect(this.get_for_you_on_hotstar).toBeVisible();

    const current_page_url_after_click = this.getcurrenturl();

    // Verify URL only if clicking this button is expected to navigate
    expect(current_page_url_after_click).not.toEqual(current_page_url);

    // Now get all the New Episodes or For You data
  });
}

  async get_all_new_epsoides_or_for_you():Promise<void>{
    await test.step("Get all the new episodes or for you contents", async ()=>{
      const dict_all_mew_episodes_and_for_you=new Map<string, string[]>();
      let processed_count=0;
      await expect(this.new_episodes_or_for_you.first()).toBeVisible();
      const initial_count=await this.new_episodes_or_for_you.count();
      expect(initial_count).toBeGreaterThan(0);

      while(true){
        const current_count=await this.new_episodes_or_for_you.count();
        for(let i=processed_count;i<current_count;i++){
          const actual_type_of_new_contnet=this.new_episodes_or_for_you.nth(i);
          const values=await actual_type_of_new_contnet.innerText();
          if(!dict_all_mew_episodes_and_for_you.has(values)){
            await test.step(`Adding new key: ${values}`, async()=>{
              dict_all_mew_episodes_and_for_you.set(values, []);
            });
          }
          const movie_image=actual_type_of_new_contnet
            .locator(this.alt_movie_name_new_for_you)
            .first();
          await expect(movie_image).toHaveAttribute("alt", /.+/);
          const actual_names_movies_new_contnet=await movie_image.getAttribute("alt");
          expect(actual_names_movies_new_contnet).not.toBeNull();
          dict_all_mew_episodes_and_for_you.get(values)?.push(actual_names_movies_new_contnet!);
        }
        processed_count=current_count;

        const scroll_position_before=await this.current_height_window();
        const scroll_position_after=await this.scroll_page_once();
        await this.page.waitForTimeout(900);
        let count_after_scroll=await this.new_episodes_or_for_you.count();
        // for(let attempt=0;attempt<10 && count_after_scroll<=processed_count;attempt++){
        //   await this.page.waitForTimeout(300);
        //   count_after_scroll=await this.new_episodes_or_for_you.count();
        // }
        if(scroll_position_before===scroll_position_after && count_after_scroll<=processed_count){
          break;
        }
      }

      await test.info().attach("new-episodes-or-for-you.json", {
        body: JSON.stringify(
          Object.fromEntries(dict_all_mew_episodes_and_for_you),
          null,
          2,
        ),
        contentType: "application/json",
      });
    });
  }
}
