import { Page, expect } from "@playwright/test";
import { adminSelectors } from "../selectors/admin.selectors";
import { SystemUser } from "../models/SystemUser";

export class UserManagementPage {
  constructor(private page: Page) {}

  async navigate() {
    await this.page.click(adminSelectors.adminMenu);
    await this.page.waitForLoadState("networkidle");
  }

  async navigateToUsers() {
    await this.navigate();
    await this.page.hover(adminSelectors.userManagementMenu);
    await this.page.click(adminSelectors.usersMenuItem);
    await this.page.waitForLoadState("networkidle");
  }

  async createSystemUser(systemUser: SystemUser) {
    await this.navigateToUsers();

    // Click Add button
    await this.page.click(adminSelectors.addButton);
    await this.page.waitForLoadState("networkidle");

    // Select User Role
    await this.page.click(adminSelectors.userRoleDropdown);
    await this.page.click(adminSelectors.userRoleOption(systemUser.userRole));
    await this.page.waitForTimeout(500);

    // Fill Employee Name
    await this.page.fill(adminSelectors.employeeNameInput, systemUser.employeeName);
    await this.page.waitForTimeout(1000);

    // Select from autocomplete
    const autocompleteOption = adminSelectors.autocompleteOption(systemUser.employeeName);
    await this.page.click(autocompleteOption);
    await this.page.waitForTimeout(500);

    // Select Status
    await this.page.click(adminSelectors.statusDropdown);
    await this.page.click(adminSelectors.statusOption(systemUser.status));
    await this.page.waitForTimeout(500);

    // Fill Username
    await this.page.fill(adminSelectors.usernameInput, systemUser.username);

    // Fill Password
    await this.page.fill(adminSelectors.passwordInput, systemUser.password);
    await this.page.fill(adminSelectors.confirmPasswordInput, systemUser.password);

    // Save
    await this.page.click(adminSelectors.saveButton);
    await this.page.waitForSelector(adminSelectors.successToast, { timeout: 10000 });
  }

  async searchUser(username: string) {
    await this.navigateToUsers();
    await this.page.fill(adminSelectors.searchUsernameInput, username);
    await this.page.click(adminSelectors.searchButton);
    await this.page.waitForLoadState("networkidle");
  }

  async verifyUserCreated(username: string) {
    await this.searchUser(username);
    const recordsText = await this.page.textContent(adminSelectors.recordsFoundText);
    expect(recordsText).toContain("(1) Record Found");
  }
}
