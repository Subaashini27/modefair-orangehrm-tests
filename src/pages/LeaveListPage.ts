import { Page, expect } from "@playwright/test";
import { leaveSelectors } from "../selectors/leave.selectors";
import { LeaveStatus } from "../models/LeaveRequest";

export class LeaveListPage {
  constructor(private page: Page) {}

  async navigate() {
    await this.page.click(leaveSelectors.leaveMenu);
    await this.page.waitForLoadState("networkidle");
  }

  async navigateToLeaveList() {
    await this.navigate();
    await this.page.click(leaveSelectors.leaveListTab);
    await this.page.waitForLoadState("networkidle");
  }

  async filterByEmployee(employeeName: string) {
    await this.page.fill(leaveSelectors.employeeNameInput, employeeName);
    await this.page.waitForTimeout(1000);

    // Select from autocomplete
    const autocompleteOption = leaveSelectors.autocompleteOption(employeeName);
    await this.page.click(autocompleteOption);
    await this.page.waitForTimeout(500);
  }

  async filterByStatus(status: LeaveStatus) {
    await this.page.click(leaveSelectors.statusDropdown);
    await this.page.waitForTimeout(500);
    await this.page.click(leaveSelectors.statusOption(status));
    await this.page.waitForTimeout(500);
  }

  async searchLeave(employeeName?: string, status?: LeaveStatus) {
    await this.navigateToLeaveList();

    if (employeeName) {
      await this.filterByEmployee(employeeName);
    }

    if (status) {
      await this.filterByStatus(status);
    }

    await this.page.click(leaveSelectors.searchButton);
    await this.page.waitForLoadState("networkidle");
    await this.page.waitForTimeout(1000);
  }

  async approveLeave(rowNumber: number = 1) {
    // Wait for table row
    await this.page.waitForSelector(leaveSelectors.leaveTableRow, { timeout: 10000 });

    // Click approve button
    const approveButton = leaveSelectors.approveButton(rowNumber);
    await this.page.click(approveButton);
    await this.page.waitForLoadState("networkidle");
    await this.page.waitForTimeout(1000);
  }

  async verifyLeaveStatus(expectedStatus: string, rowNumber: number = 1) {
    await this.page.waitForSelector(leaveSelectors.leaveTableRow, { timeout: 10000 });

    const statusCell = leaveSelectors.leaveStatusCell(rowNumber);
    await this.page.waitForSelector(statusCell);
    const statusText = await this.page.textContent(statusCell);

    expect(statusText?.trim()).toContain(expectedStatus);
  }

  async getLeaveRecordsCount(): Promise<number> {
    const recordsText = await this.page.textContent(leaveSelectors.recordsFoundText);
    const match = recordsText?.match(/\((\d+)\)/);
    return match ? parseInt(match[1]) : 0;
  }

  async verifyLeaveExists(employeeName: string) {
    await this.searchLeave(employeeName);
    const count = await this.getLeaveRecordsCount();
    expect(count).toBeGreaterThan(0);
  }
}
