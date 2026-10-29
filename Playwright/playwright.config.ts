import "dotenv/config";
import { defineConfig, devices } from "@playwright/test";
import { BrowserName } from "./src/enums/browser-name.enum";
import { FileReader } from "./src/utils/FileReader";


const appConfig = FileReader.readconfigFile();
const webConfig_url = appConfig.browsers.web_site;


export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : 1,
  reporter: [
    ["list"],
    ["allure-playwright", { outputFolder: "test-results/allure-results" }],
  ],

  use: {
    headless: process.env.HEADLESS !== "false",

    baseURL: webConfig_url || process.env.BASE_URL || "localhost:3000",
    trace: "retain-on-failure",
    screenshot: "only-on-failure",


  },
  outputDir: 'test-results/', 
  projects: [
    // ── Desktop Web ──────────────────────────────────────────────────────────
    {
      name: BrowserName.Chromium,
      use: { 
        ...devices['Desktop Chrome'] },
    },
    // {
    //   name: BrowserName.Firefox,
    //   use: { ...devices['Desktop Firefox'] },
    // },
    // {
    //   name: BrowserName.Edge,
    //   use: { ...devices['Desktop Edge'] },
    // },
  ]
});
