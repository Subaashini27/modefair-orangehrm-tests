import { Page } from "@playwright/test";
import { ILeaveRepository } from "./ILeaveRepository";
import { LeaveRequest, LeaveType, LeaveStatus } from "../models/LeaveRequest";
import { leaveSelectors } from "../selectors/leave.selectors";

export class UiLeaveRepository implements ILeaveRepository {
  constructor(private page: Page) {}

  async getLeaveRequests(employeeName?: string): Promise<LeaveRequest[]> {
    // Navigate to Leave List
    await this.page.click(leaveSelectors.leaveMenu);
    await this.page.waitForLoadState("networkidle");
    await this.page.click(leaveSelectors.leaveListTab);
    await this.page.waitForLoadState("networkidle");

    if (employeeName) {
      await this.page.fill(leaveSelectors.employeeNameInput, employeeName);
      await this.page.waitForTimeout(1000);

      const autocompleteOption = leaveSelectors.autocompleteOption(employeeName);
      await this.page.click(autocompleteOption);
      await this.page.waitForTimeout(500);
    }

    await this.page.click(leaveSelectors.searchButton);
    await this.page.waitForLoadState("networkidle");
    await this.page.waitForTimeout(1000);

    // Parse table rows
    const rows = await this.page.locator(leaveSelectors.leaveTableRow).all();
    const leaveRequests: LeaveRequest[] = [];

    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      const cells = await row.locator("div.oxd-table-cell").all();

      if (cells.length >= 6) {
        const empName = await cells[1].textContent();
        const leaveType = await cells[2].textContent();
        const dateRange = await cells[3].textContent();
        const status = await cells[5].textContent();

        // Parse dates from range (format: "YYYY-MM-DD to YYYY-MM-DD")
        const dates = dateRange?.trim().split(" to ") || [];
        const fromDate = dates[0] ? new Date(dates[0]) : new Date();
        const toDate = dates[1] ? new Date(dates[1]) : fromDate;

        leaveRequests.push(
          new LeaveRequest({
            leaveType: this.mapLeaveType(leaveType?.trim() || ""),
            fromDate,
            toDate,
            employeeName: empName?.trim(),
            status: this.mapLeaveStatus(status?.trim() || ""),
          })
        );
      }
    }

    return leaveRequests;
  }

  async getLeaveRequestByEmployee(employeeName: string): Promise<LeaveRequest | null> {
    const requests = await this.getLeaveRequests(employeeName);
    return requests.length > 0 ? requests[0] : null;
  }

  private mapLeaveType(type: string): LeaveType {
    if (type.includes("FMLA")) return LeaveType.ANNUAL_LEAVE;
    if (type.includes("Personal")) return LeaveType.SICK_LEAVE;
    return LeaveType.ANNUAL_LEAVE;
  }

  private mapLeaveStatus(status: string): LeaveStatus {
    if (status.includes("Pending")) return LeaveStatus.PENDING_APPROVAL;
    if (status.includes("Approved")) return LeaveStatus.APPROVED;
    if (status.includes("Rejected")) return LeaveStatus.REJECTED;
    if (status.includes("Cancelled")) return LeaveStatus.CANCELLED;
    return LeaveStatus.PENDING_APPROVAL;
  }
}
