import { test, expect } from "../fixtures/roles";
import { PIMPage } from "../pages/PIMPage";
import * as fs from "fs";
import * as path from "path";

const testDataPath = path.join(__dirname, "../../test-data.json");

test.describe("Admin - Assign Supervisor to Employee", () => {
  let employeeFullName: string;
  const supervisorName = "Odis Adalwin"; // Using existing supervisor from demo data

  test.beforeAll(() => {
    // Read test data from previous test
    if (fs.existsSync(testDataPath)) {
      const testData = JSON.parse(fs.readFileSync(testDataPath, "utf-8"));
      employeeFullName = testData.employee.fullName;
      console.log(`Using employee: ${employeeFullName}`);
    }
  });

  test("Step 3: Admin should assign a supervisor to the employee", async ({ adminPage }) => {
    test.skip(!employeeFullName, "No employee data found. Run admin.create-employee.spec.ts first");

    const pimPage = new PIMPage(adminPage);

    // Open employee profile
    await pimPage.openEmployeeProfile(employeeFullName);

    // Assign supervisor
    await pimPage.assignSupervisor(supervisorName);

    console.log(`✓ Supervisor "${supervisorName}" assigned to employee "${employeeFullName}"`);

    // Update test data with supervisor info
    if (fs.existsSync(testDataPath)) {
      const testData = JSON.parse(fs.readFileSync(testDataPath, "utf-8"));
      testData.supervisor = {
        name: supervisorName,
        assignedAt: new Date().toISOString(),
      };
      fs.writeFileSync(testDataPath, JSON.stringify(testData, null, 2));
    }
  });

  test("Step 4: Verify supervisor assignment in employee Report-to tab", async ({
    adminPage,
  }) => {
    test.skip(!employeeFullName, "No employee data found. Run admin.create-employee.spec.ts first");

    const pimPage = new PIMPage(adminPage);

    // Navigate back to employee and verify
    await pimPage.openEmployeeProfile(employeeFullName);
    await adminPage.click('//a[text()="Report-to"]');
    await adminPage.waitForLoadState("networkidle");

    // Verify supervisor is listed
    const supervisorLocator = adminPage.locator(`text=${supervisorName}`);
    await expect(supervisorLocator).toBeVisible({ timeout: 5000 });

    console.log(`✓ Verified supervisor assignment`);
  });
});
