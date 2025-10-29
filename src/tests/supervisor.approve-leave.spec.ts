import { test, expect } from "../fixtures/roles";
import { LeaveListPage } from "../pages/LeaveListPage";
import { LeaveStatus } from "../models/LeaveRequest";
import * as fs from "fs";
import * as path from "path";

const testDataPath = path.join(__dirname, "../../test-data.json");

test.describe("Supervisor - Approve Leave Request", () => {
  let employeeFullName: string;

  test.beforeAll(() => {
    // Read test data
    if (fs.existsSync(testDataPath)) {
      const testData = JSON.parse(fs.readFileSync(testDataPath, "utf-8"));
      employeeFullName = testData.employee.fullName;
    }

    // Set supervisor credentials (using existing supervisor from OrangeHRM demo)
    // In real scenario, you'd create a supervisor account
    process.env.SUPERVISOR_USERNAME = "Admin"; // Using admin as supervisor for demo
    process.env.SUPERVISOR_PASSWORD = "admin123";
  });

  test("Step 7: Supervisor should login and view pending leave requests", async ({
    supervisorPage,
  }) => {
    test.skip(
      !process.env.SUPERVISOR_USERNAME || !process.env.SUPERVISOR_PASSWORD,
      "No supervisor credentials found"
    );

    const leaveListPage = new LeaveListPage(supervisorPage);

    // Search for pending leave requests
    await leaveListPage.searchLeave(undefined, LeaveStatus.PENDING_APPROVAL);

    const count = await leaveListPage.getLeaveRecordsCount();
    expect(count).toBeGreaterThan(0);

    console.log(`✓ Found ${count} pending leave request(s)`);
  });

  test("Step 8: Supervisor should approve the employee's leave request", async ({
    supervisorPage,
  }) => {
    test.skip(
      !process.env.SUPERVISOR_USERNAME || !process.env.SUPERVISOR_PASSWORD,
      "No supervisor credentials found"
    );
    test.skip(!employeeFullName, "No employee data found");

    const leaveListPage = new LeaveListPage(supervisorPage);

    // Search for pending leave by employee name
    await leaveListPage.searchLeave(employeeFullName, LeaveStatus.PENDING_APPROVAL);

    // Approve the first leave request
    await leaveListPage.approveLeave(1);

    console.log(`✓ Leave request approved for ${employeeFullName}`);

    // Update test data
    if (fs.existsSync(testDataPath)) {
      const testData = JSON.parse(fs.readFileSync(testDataPath, "utf-8"));
      if (testData.leaveRequest) {
        testData.leaveRequest.approvedAt = new Date().toISOString();
        testData.leaveRequest.approvedBy = process.env.SUPERVISOR_USERNAME;
      }
      fs.writeFileSync(testDataPath, JSON.stringify(testData, null, 2));
    }
  });

  test("Step 9: Supervisor should verify leave status changed to Approved", async ({
    supervisorPage,
  }) => {
    test.skip(
      !process.env.SUPERVISOR_USERNAME || !process.env.SUPERVISOR_PASSWORD,
      "No supervisor credentials found"
    );
    test.skip(!employeeFullName, "No employee data found");

    const leaveListPage = new LeaveListPage(supervisorPage);

    // Search for approved leaves by employee
    await leaveListPage.searchLeave(employeeFullName, LeaveStatus.APPROVED);

    // Verify status
    await leaveListPage.verifyLeaveStatus("Approved", 1);

    console.log(`✓ Verified leave status is "Approved"`);
  });
});
