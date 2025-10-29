import { Page, expect } from "@playwright/test";
import { leaveSelectors } from "../selectors/leave.selectors";
import { LeaveRequest } from "../models/LeaveRequest";

export class LeaveApplyPage {
  constructor(private page: Page) {}

  async navigate() {
    await this.page.click(leaveSelectors.leaveMenu);
    await this.page.waitForLoadState("networkidle");
  }

  async navigateToApply() {
    await this.navigate();
    await this.page.click(leaveSelectors.applyTab);
    await this.page.waitForLoadState("networkidle");
  }

  async applyLeave(leaveRequest: LeaveRequest) {
    await this.navigateToApply();

    // Select Leave Type
    await this.page.click(leaveSelectors.leaveTypeDropdown);
    await this.page.waitForTimeout(500);
    await this.page.click(leaveSelectors.leaveTypeOption(leaveRequest.leaveType));
    await this.page.waitForTimeout(500);

    // Fill From Date
    await this.page.fill(leaveSelectors.fromDateInput, leaveRequest.fromDateFormatted);
    await this.page.waitForTimeout(300);

    // Fill To Date
    await this.page.fill(leaveSelectors.toDateInput, leaveRequest.toDateFormatted);
    await this.page.waitForTimeout(300);

    // Fill Comments (optional)
    if (leaveRequest.comment) {
      await this.page.fill(leaveSelectors.commentsTextarea, leaveRequest.comment);
    }

    // Apply
    await this.page.click(leaveSelectors.applyButton);
    await this.page.waitForSelector(leaveSelectors.successToast, { timeout: 10000 });
  }

  async navigateToMyLeave() {
    await this.navigate();
    await this.page.click(leaveSelectors.myLeaveTab);
    await this.page.waitForLoadState("networkidle");
  }

  async verifyLeaveStatus(expectedStatus: string) {
    await this.navigateToMyLeave();

    // Wait for table to load
    await this.page.waitForSelector(leaveSelectors.leaveTableRow, { timeout: 10000 });

    // Get the first row's status
    const statusCell = leaveSelectors.leaveStatusCell(1);
    await this.page.waitForSelector(statusCell);
    const statusText = await this.page.textContent(statusCell);

    expect(statusText?.trim()).toContain(expectedStatus);
  }
}
