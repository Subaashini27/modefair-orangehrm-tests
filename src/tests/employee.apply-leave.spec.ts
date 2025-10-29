import { test, expect } from "../fixtures/roles";
import { LeaveApplyPage } from "../pages/LeaveApplyPage";
import { LeaveRequest, LeaveType, LeaveStatus } from "../models/LeaveRequest";
import * as fs from "fs";
import * as path from "path";

const testDataPath = path.join(__dirname, "../../test-data.json");

test.describe("Employee - Apply for Leave", () => {
  let leaveRequest: LeaveRequest;
  let employeeUsername: string;
  let employeePassword: string;

  test.beforeAll(() => {
    // Read test data
    if (fs.existsSync(testDataPath)) {
      const testData = JSON.parse(fs.readFileSync(testDataPath, "utf-8"));
      employeeUsername = testData.systemUser.username;
      employeePassword = testData.systemUser.password;

      // Set in environment for fixture to use
      process.env.EMPLOYEE_USERNAME = employeeUsername;
      process.env.EMPLOYEE_PASSWORD = employeePassword;
    }

    // Create a leave request for future dates (5 days from now for 3 days)
    const fromDate = new Date();
    fromDate.setDate(fromDate.getDate() + 5);

    const toDate = new Date(fromDate);
    toDate.setDate(toDate.getDate() + 2); // 3 days leave

    leaveRequest = LeaveRequest.createAnnualLeave(
      fromDate,
      toDate,
      "Automation test - Annual leave request for family vacation"
    );
  });

  test("Step 5: Employee should login and apply for annual leave", async ({ employeePage }) => {
    test.skip(
      !employeeUsername || !employeePassword,
      "No employee credentials found. Run previous tests first"
    );

    const leaveApplyPage = new LeaveApplyPage(employeePage);

    // Apply for leave
    await leaveApplyPage.applyLeave(leaveRequest);

    console.log(
      `✓ Leave applied from ${leaveRequest.fromDateFormatted} to ${leaveRequest.toDateFormatted}`
    );

    // Save leave request details
    if (fs.existsSync(testDataPath)) {
      const testData = JSON.parse(fs.readFileSync(testDataPath, "utf-8"));
      testData.leaveRequest = {
        fromDate: leaveRequest.fromDateFormatted,
        toDate: leaveRequest.toDateFormatted,
        comment: leaveRequest.comment,
        appliedAt: new Date().toISOString(),
      };
      fs.writeFileSync(testDataPath, JSON.stringify(testData, null, 2));
    }
  });

  test("Step 6: Employee should verify leave request is Pending Approval in My Leave", async ({
    employeePage,
  }) => {
    test.skip(
      !employeeUsername || !employeePassword,
      "No employee credentials found. Run previous tests first"
    );

    const leaveApplyPage = new LeaveApplyPage(employeePage);

    // Navigate to My Leave and verify status
    await leaveApplyPage.verifyLeaveStatus("Pending Approval");

    console.log(`✓ Leave status verified as "Pending Approval"`);
  });
});
