import { test, expect } from "../fixtures/roles";
import { LeaveListPage } from "../pages/LeaveListPage";
import { LeaveStatus } from "../models/LeaveRequest";
import { UiLeaveRepository } from "../services/UiLeaveRepository";
import * as fs from "fs";
import * as path from "path";

const testDataPath = path.join(__dirname, "../../test-data.json");

test.describe("Admin - Verify Approved Leave Request", () => {
  let employeeFullName: string;

  test.beforeAll(() => {
    // Read test data
    if (fs.existsSync(testDataPath)) {
      const testData = JSON.parse(fs.readFileSync(testDataPath, "utf-8"));
      employeeFullName = testData.employee.fullName;
    }
  });

  test("Step 10: Admin should view the approved leave request in Leave List", async ({
    adminPage,
  }) => {
    test.skip(!employeeFullName, "No employee data found");

    const leaveListPage = new LeaveListPage(adminPage);

    // Search for approved leaves by employee
    await leaveListPage.searchLeave(employeeFullName, LeaveStatus.APPROVED);

    // Verify at least one approved leave exists
    const count = await leaveListPage.getLeaveRecordsCount();
    expect(count).toBeGreaterThan(0);

    console.log(`✓ Found ${count} approved leave request(s) for ${employeeFullName}`);
  });

  test("Step 11: Admin should verify approved leave using UI Repository pattern", async ({
    adminPage,
  }) => {
    test.skip(!employeeFullName, "No employee data found");

    const uiLeaveRepository = new UiLeaveRepository(adminPage);

    // Fetch leave requests from UI using repository
    const leaveRequests = await uiLeaveRepository.getLeaveRequests(employeeFullName);

    // Verify we have approved leave requests
    const approvedLeaves = leaveRequests.filter((leave) => leave.status === LeaveStatus.APPROVED);

    expect(approvedLeaves.length).toBeGreaterThan(0);

    console.log(`✓ Repository pattern: Found ${approvedLeaves.length} approved leave(s)`);

    // Log leave details
    if (approvedLeaves.length > 0) {
      const leave = approvedLeaves[0];
      console.log(`  - Leave Type: ${leave.leaveType}`);
      console.log(`  - From: ${leave.fromDateFormatted}`);
      console.log(`  - To: ${leave.toDateFormatted}`);
      console.log(`  - Status: ${leave.status}`);
    }
  });

  test("Step 12: Admin should verify leave data structure using repository", async ({
    adminPage,
  }) => {
    test.skip(!employeeFullName, "No employee data found");

    const uiLeaveRepository = new UiLeaveRepository(adminPage);

    // Fetch leave requests by employee
    const leaveRequest = await uiLeaveRepository.getLeaveRequestByEmployee(employeeFullName);

    if (leaveRequest) {
      // Verify leave request has required properties
      expect(leaveRequest).toHaveProperty("leaveType");
      expect(leaveRequest).toHaveProperty("fromDate");
      expect(leaveRequest).toHaveProperty("toDate");
      expect(leaveRequest).toHaveProperty("status");
      expect(leaveRequest).toHaveProperty("employeeName");

      // Verify dates are valid
      expect(leaveRequest.fromDate).toBeInstanceOf(Date);
      expect(leaveRequest.toDate).toBeInstanceOf(Date);

      // Verify LeaveRequest class methods work
      expect(typeof leaveRequest.fromDateFormatted).toBe("string");
      expect(typeof leaveRequest.toDateFormatted).toBe("string");

      console.log(`✓ Data structure validation passed`);
      console.log(`  - Employee: ${leaveRequest.employeeName}`);
      console.log(`  - Status: ${leaveRequest.status}`);
    } else {
      console.log(`⚠ No leave request found for ${employeeFullName}`);
    }
  });
});
