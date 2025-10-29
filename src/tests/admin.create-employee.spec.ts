import { test, expect } from "../fixtures/roles";
import { PIMPage } from "../pages/PIMPage";
import { UserManagementPage } from "../pages/UserManagementPage";
import { Employee } from "../models/Employee";
import { SystemUser, UserRole, UserStatus } from "../models/SystemUser";
import * as fs from "fs";
import * as path from "path";

// Store test data in a JSON file for use across test files
const testDataPath = path.join(__dirname, "../../test-data.json");

test.describe("Admin - Create Employee and System User", () => {
  let employeeData: Employee;
  let systemUserData: SystemUser;
  let employeeId: string;

  test.beforeAll(() => {
    // Generate unique employee data with timestamp
    const timestamp = Date.now();
    const firstName = `TestEmp${timestamp}`;
    const lastName = "Automation";

    employeeData = Employee.create(firstName, lastName);

    // Create system user credentials
    const username = `emp${timestamp}`;
    const password = "TestPass123!";

    systemUserData = SystemUser.createESSUser(employeeData.fullName, username, password);

    // Store credentials in environment for other tests
    process.env.EMPLOYEE_USERNAME = username;
    process.env.EMPLOYEE_PASSWORD = password;
    process.env.EMPLOYEE_FULLNAME = employeeData.fullName;
  });

  test("Step 1: Admin should create a new employee in PIM", async ({ adminPage }) => {
    const pimPage = new PIMPage(adminPage);

    // Create employee
    employeeId = await pimPage.createEmployee(employeeData);

    // Verify employee was created
    await pimPage.verifyEmployeeCreated(employeeData.fullName);

    console.log(`✓ Employee created: ${employeeData.fullName} (ID: ${employeeId})`);
  });

  test("Step 2: Admin should create a System User (ESS) for the employee", async ({
    adminPage,
  }) => {
    const userManagementPage = new UserManagementPage(adminPage);

    // Create system user
    await userManagementPage.createSystemUser(systemUserData);

    // Verify user was created
    await userManagementPage.verifyUserCreated(systemUserData.username);

    // Save test data for subsequent tests
    const testData = {
      employee: {
        firstName: employeeData.firstName,
        lastName: employeeData.lastName,
        fullName: employeeData.fullName,
        employeeId: employeeId,
      },
      systemUser: {
        username: systemUserData.username,
        password: systemUserData.password,
      },
      createdAt: new Date().toISOString(),
    };

    fs.writeFileSync(testDataPath, JSON.stringify(testData, null, 2));

    console.log(`✓ System User created: ${systemUserData.username}`);
    console.log(`✓ Test data saved to: ${testDataPath}`);
  });
});
