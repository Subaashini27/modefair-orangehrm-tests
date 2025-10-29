import { Page, expect } from "@playwright/test";
import { pimSelectors } from "../selectors/pim.selectors";
import { Employee } from "../models/Employee";

export class PIMPage {
  constructor(private page: Page) {}

  async navigate() {
    await this.page.click(pimSelectors.pimMenu);
    await this.page.waitForLoadState("networkidle");
  }

  async navigateToAddEmployee() {
    await this.navigate();
    await this.page.click(pimSelectors.addEmployeeTab);
    await this.page.waitForLoadState("networkidle");
  }

  async createEmployee(employee: Employee, createLogin: boolean = false): Promise<string> {
    await this.navigateToAddEmployee();

    // Fill employee details
    await this.page.fill(pimSelectors.firstNameInput, employee.firstName);
    if (employee.middleName) {
      await this.page.fill(pimSelectors.middleNameInput, employee.middleName);
    }
    await this.page.fill(pimSelectors.lastNameInput, employee.lastName);

    // Get the auto-generated employee ID
    const employeeId = await this.page.inputValue(pimSelectors.employeeIdInput);

    if (createLogin) {
      // Toggle create login details
      await this.page.click(pimSelectors.createLoginToggle);
      await this.page.waitForTimeout(500);
    }

    // Save
    await this.page.click(pimSelectors.saveButton);
    await this.page.waitForSelector(pimSelectors.successToast, { timeout: 10000 });

    return employeeId;
  }

  async navigateToEmployeeList() {
    await this.navigate();
    await this.page.click(pimSelectors.employeeListTab);
    await this.page.waitForLoadState("networkidle");
  }

  async searchEmployee(employeeName: string) {
    await this.navigateToEmployeeList();
    await this.page.fill(pimSelectors.searchEmployeeNameInput, employeeName);
    await this.page.waitForTimeout(1000);

    // Select from autocomplete
    const autocompleteOption = pimSelectors.autocompleteOption(employeeName);
    await this.page.click(autocompleteOption);

    await this.page.click(pimSelectors.searchButton);
    await this.page.waitForLoadState("networkidle");
  }

  async openEmployeeProfile(employeeName: string) {
    await this.searchEmployee(employeeName);
    await this.page.waitForSelector(pimSelectors.employeeNameLink(employeeName));
    await this.page.click(pimSelectors.employeeNameLink(employeeName));
    await this.page.waitForLoadState("networkidle");
  }

  async assignSupervisor(supervisorName: string, reportingMethod: string = "Direct") {
    // Navigate to Report-to tab
    await this.page.click(pimSelectors.reportToTab);
    await this.page.waitForLoadState("networkidle");

    // Click add supervisor
    await this.page.click(pimSelectors.addSupervisorButton);
    await this.page.waitForTimeout(500);

    // Fill supervisor name
    await this.page.fill(pimSelectors.supervisorNameInput, supervisorName);
    await this.page.waitForTimeout(1000);

    // Select from autocomplete
    const autocompleteOption = pimSelectors.autocompleteOption(supervisorName);
    await this.page.click(autocompleteOption);
    await this.page.waitForTimeout(500);

    // Select reporting method
    await this.page.click(pimSelectors.reportingMethodDropdown);
    await this.page.click(pimSelectors.reportingMethodOption(reportingMethod));

    // Save
    await this.page.click(pimSelectors.supervisorSaveButton);
    await this.page.waitForSelector(pimSelectors.supervisorSuccessToast, { timeout: 10000 });
  }

  async verifyEmployeeCreated(employeeName: string) {
    await this.searchEmployee(employeeName);
    const recordsText = await this.page.textContent(pimSelectors.recordsFoundText);
    expect(recordsText).toContain("(1) Record Found");
  }
}
