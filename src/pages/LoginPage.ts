import { Page } from "@playwright/test";
import { loginSelectors } from "../selectors/login.selectors";

export class LoginPage {
  constructor(private page: Page) {}

  async goto() {
    await this.page.goto("/");
  }

  async login(username: string, password: string) {
    await this.page.fill(loginSelectors.usernameInput, username);
    await this.page.fill(loginSelectors.passwordInput, password);
    await this.page.click(loginSelectors.loginButton);
  }

  async expectLoggedIn() {
    await this.page.waitForSelector(loginSelectors.dashboardHeader, { timeout: 5000 });
  }
}
