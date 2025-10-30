# OrangeHRM Automation Test Suite

A comprehensive Playwright + TypeScript test automation suite for OrangeHRM Open Source Demo, implementing Object-Oriented Programming (OOP), Page Object Model (POM), and maintainable test design patterns.

##  Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running Tests](#running-tests)
- [Test Reports](#test-reports)
- [Design Patterns](#design-patterns)
- [Business Scenario](#business-scenario)
- [Assumptions & Notes](#assumptions--notes)

##  Overview

This test suite automates an end-to-end HR workflow on the [OrangeHRM Demo Site](https://opensource-demo.orangehrmlive.com/) covering:

1. **Admin** - Create employee, create system user, assign supervisor
2. **Employee** - Apply for leave and verify status
3. **Supervisor** - Approve leave requests
4. **Admin** - Verify approved leaves and validate data

##  Features

- ✅ **TypeScript with strict mode** - Full type safety
- ✅ **Page Object Model (POM)** - Maintainable page abstractions
- ✅ **Separated Selectors** - Dedicated selector files per module
- ✅ **Value Objects** - Domain models with validation (Employee, SystemUser, LeaveRequest)
- ✅ **Repository Pattern** - Abstract data access (UI and CSV implementations)
- ✅ **Role-based Fixtures** - Authenticated contexts for Admin, Employee, Supervisor
- ✅ **Environment Variables** - No hardcoded credentials
- ✅ **Robust Waits** - No hard sleeps, proper synchronization
- ✅ **HTML Reports** - Comprehensive test reporting with traces on retry
- ✅ **Prettier Formatting** - Consistent code style

##  Project Structure

```
modefair-orangehrm-tests/
├── playwright.config.ts          # Playwright configuration
├── package.json                  # Dependencies and scripts
├── .prettierrc                   # Prettier formatting rules
├── .env                          # Environment variables (credentials)
├── README.md                     # This file
└── src/
    ├── selectors/                # UI selectors (separated from page objects)
    │   ├── login.selectors.ts
    │   ├── pim.selectors.ts
    │   ├── admin.selectors.ts
    │   └── leave.selectors.ts
    ├── pages/                    # Page Object Model classes
    │   ├── LoginPage.ts
    │   ├── PIMPage.ts
    │   ├── UserManagementPage.ts
    │   ├── LeaveApplyPage.ts
    │   └── LeaveListPage.ts
    ├── models/                   # Domain models (Value Objects)
    │   ├── Employee.ts
    │   ├── SystemUser.ts
    │   └── LeaveRequest.ts
    ├── services/                 # Repository pattern implementations
    │   ├── ILeaveRepository.ts
    │   ├── UiLeaveRepository.ts
    │   └── CsvLeaveRepository.ts
    ├── fixtures/                 # Test fixtures for role-based authentication
    │   └── roles.ts
    └── tests/                    # Test specifications
        ├── admin.create-employee.spec.ts
        ├── admin.assign-supervisor.spec.ts
        ├── employee.apply-leave.spec.ts
        ├── supervisor.approve-leave.spec.ts
        └── admin.verify-leave.spec.ts
```

## 🔧 Prerequisites

- **Node.js** - v18 or higher
- **npm** - v9 or higher
- **Git** - For cloning the repository

##  Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Subaashini27/modefair-orangehrm
   cd modefair-orangehrm-tests
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Install Playwright browsers**
   ```bash
   npx playwright install
   ```

##  Configuration

### Environment Variables

Create or update the `.env` file in the root directory:

```env
# Admin credentials (provided by OrangeHRM demo)
ADMIN_USERNAME=Admin
ADMIN_PASSWORD=admin123

# Employee credentials (will be auto-generated during tests)
EMPLOYEE_USERNAME=
EMPLOYEE_PASSWORD=

# Supervisor credentials (optional - use existing supervisor)
SUPERVISOR_USERNAME=
SUPERVISOR_PASSWORD=
```

**Note**: Employee and Supervisor credentials are dynamically created during the test execution. The Admin test creates the employee user, and credentials are stored in environment variables for subsequent tests.

### Playwright Configuration

The `playwright.config.ts` includes:
- Base URL: `https://opensource-demo.orangehrmlive.com`
- Timeout: 60 seconds
- Retries: 1 (with trace on retry)
- Screenshots on failure
- Video retention on failure
- HTML reporter

##  Running Tests

### Run all tests
```bash
npm test
```

### Run tests in headed mode (see browser)
```bash
npm run test:headed
```

### Run tests in UI mode (interactive)
```bash
npm run test:ui
```

### Run specific test file
```bash
npx playwright test src/tests/admin.create-employee.spec.ts
```

### Run tests by tag or pattern
```bash
npx playwright test --grep "Admin"
```

##  Test Reports

### View HTML report
After test execution:
```bash
npm run test:report
```

The HTML report includes:
- Test results with pass/fail status
- Execution time and duration
- Screenshots on failure
- Traces for retried tests
- Detailed step-by-step logs

### Report Location
- HTML Report: `playwright-report/index.html`
- Test Results: `test-results/`

##  Design Patterns

### 1. Page Object Model (POM)
Each page/module has a dedicated class encapsulating:
- Navigation methods
- Action methods
- Assertion methods

Example: `PIMPage`, `LeaveApplyPage`

### 2. Separated Selectors
Selectors are maintained in dedicated files, separate from page objects:
- Easy to update when UI changes
- Centralized selector management
- No duplication

### 3. Value Objects (Domain Models)
Domain models implemented as classes with validation:
- `Employee` - Validates first/last name, provides fullName
- `SystemUser` - Validates username (min 5 chars), password (min 7 chars)
- `LeaveRequest` - Validates dates, provides date formatting

### 4. Repository Pattern
Abstraction for data access with multiple implementations:
- `ILeaveRepository` - Interface defining contract
- `UiLeaveRepository` - Fetches data from UI grid
- `CsvLeaveRepository` - Parses data from CSV export

### 5. Fixtures
Role-based authenticated contexts:
- `adminPage` - Pre-authenticated Admin session
- `employeePage` - Pre-authenticated Employee session
- `supervisorPage` - Pre-authenticated Supervisor session

## 📖 Business Scenario

### Test Flow

#### 1. Admin: Create Employee (admin.create-employee.spec.ts)
- Navigate to PIM → Add Employee
- Create new employee with unique timestamp-based name
- Generate employee ID
- Create System User (ESS) for the employee
- Store credentials in environment variables

#### 2. Admin: Assign Supervisor (admin.assign-supervisor.spec.ts)
- Navigate to PIM → Employee List
- Search for newly created employee
- Open employee profile
- Navigate to Report-to tab
- Assign a supervisor

#### 3. Employee: Apply Leave (employee.apply-leave.spec.ts)
- Login with employee credentials
- Navigate to Leave → Apply
- Request Annual Leave for future dates
- Verify request appears in Leave → My Leave with "Pending Approval" status

#### 4. Supervisor: Approve Leave (supervisor.approve-leave.spec.ts)
- Login with supervisor credentials
- Navigate to Leave → Leave List
- Filter for employee's pending leave
- Approve the leave request
- Verify status changes to "Approved"

#### 5. Admin: Verify Leave (admin.verify-leave.spec.ts)
- Login with admin credentials
- Navigate to Leave → Leave List
- Confirm approved leave is present
- Use Repository pattern to validate data structure
- (Optional) Export and validate CSV data

## 📝 Assumptions & Notes

### Assumptions
1. **Demo Site Limitations**: The OrangeHRM demo site resets periodically, so dynamically created users may not persist across sessions.

2. **Supervisor Assignment**: Due to the dynamic nature of employee creation, the supervisor assignment test uses a known supervisor from the demo system.

3. **Leave Types**: The test uses "CAN - FMLA" as the Annual Leave type, which is available in the demo system.

4. **Timestamps**: Employee names include timestamps to ensure uniqueness during parallel test runs.

5. **Network Stability**: Tests assume stable network connectivity to the demo site.

### Known Limitations
1. **Demo Site State**: The OrangeHRM demo resets frequently, so some tests may need to handle existing data.

2. **Supervisor Credentials**: Supervisor credentials must be manually set in `.env` file or an existing supervisor must be used.

3. **CSV Export**: The CSV export feature may not be available in all demo configurations, so the CSV repository test is optional.

### Best Practices Implemented
- ✅ No hardcoded credentials
- ✅ No hard sleeps (using `waitForSelector`, `waitForLoadState`)
- ✅ Proper error handling in Value Objects
- ✅ TypeScript strict mode enabled
- ✅ Consistent code formatting with Prettier
- ✅ Meaningful test names and assertions
- ✅ Screenshots and traces on failure/retry

##  Test Execution Strategy

### Recommended Order
Tests should be executed in sequence for the full end-to-end workflow:

1. `admin.create-employee.spec.ts` - Creates test data
2. `admin.assign-supervisor.spec.ts` - Assigns relationships
3. `employee.apply-leave.spec.ts` - Employee actions
4. `supervisor.approve-leave.spec.ts` - Supervisor actions
5. `admin.verify-leave.spec.ts` - Verification

### Parallel Execution
Tests can be run in parallel with `fullyParallel: false` for the Admin tests that create shared data, and `fullyParallel: true` for independent verification tests.

##  Debugging

### Debug a specific test
```bash
npx playwright test src/tests/admin.create-employee.spec.ts --debug
```

### View trace files
```bash
npx playwright show-trace test-results/<test-name>/trace.zip
```

## Code Formatting

Format all code:
```bash
npm run format
```

