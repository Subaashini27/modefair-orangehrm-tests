import { test as base, Page } from "@playwright/test";
import { LoginPage } from "../pages/LoginPage";

type RoleFixtures = {
  adminPage: Page;
  employeePage: Page;
  supervisorPage: Page;
};

export const test = base.extend<RoleFixtures>({
  adminPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(process.env.ADMIN_USERNAME!, process.env.ADMIN_PASSWORD!);
    await loginPage.expectLoggedIn();
    await use(page);
  },

  employeePage: async ({ browser }, use) => {
    const context = await browser.newContext();
    const page = await context.newPage();

    const loginPage = new LoginPage(page);
    await loginPage.goto();

    const username = process.env.EMPLOYEE_USERNAME || "";
    const password = process.env.EMPLOYEE_PASSWORD || "";

    if (username && password) {
      await loginPage.login(username, password);
      await loginPage.expectLoggedIn();
    }

    await use(page);
    await context.close();
  },

  supervisorPage: async ({ browser }, use) => {
    const context = await browser.newContext();
    const page = await context.newPage();

    const loginPage = new LoginPage(page);
    await loginPage.goto();

    const username = process.env.SUPERVISOR_USERNAME || "";
    const password = process.env.SUPERVISOR_PASSWORD || "";

    if (username && password) {
      await loginPage.login(username, password);
      await loginPage.expectLoggedIn();
    }

    await use(page);
    await context.close();
  },
});

export { expect } from "@playwright/test";
