import { defineConfig } from "@playwright/test";
import * as dotenv from "dotenv";

dotenv.config();

export default defineConfig({
  testDir: "./src/tests",
  timeout: 60000,
  retries: 1,
  use: {
    baseURL: "https://opensource-demo.orangehrmlive.com",
    headless: true,
    viewport: { width: 1280, height: 720 },
    screenshot: "only-on-failure",
    video: "retain-on-failure",
    trace: "on-first-retry",
  },
  reporter: [["html"]],
});
