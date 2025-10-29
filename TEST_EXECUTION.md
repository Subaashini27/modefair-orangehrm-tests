# Test Execution Guide

## Quick Start

### 1. Install Dependencies
```bash
npm install
npx playwright install
```

### 2. Run Tests in Sequence
The tests must be run in order as they depend on data from previous tests:

```bash
# Run all tests in sequence
npm test

# Or run individually in this order:
npx playwright test src/tests/admin.create-employee.spec.ts
npx playwright test src/tests/admin.assign-supervisor.spec.ts
npx playwright test src/tests/employee.apply-leave.spec.ts
npx playwright test src/tests/supervisor.approve-leave.spec.ts
npx playwright test src/tests/admin.verify-leave.spec.ts
```

### 3. View Report
```bash
npm run test:report
```

## Test Execution Flow

```
┌─────────────────────────────────────────────────┐
│ Step 1-2: Admin Creates Employee & System User │
│   - Creates new employee in PIM                 │
│   - Creates ESS system user                     │
│   - Saves credentials to test-data.json         │
└────────────────┬────────────────────────────────┘
                 │
┌────────────────▼────────────────────────────────┐
│ Step 3-4: Admin Assigns Supervisor              │
│   - Assigns supervisor to employee              │
│   - Verifies assignment in Report-to tab        │
└────────────────┬────────────────────────────────┘
                 │
┌────────────────▼────────────────────────────────┐
│ Step 5-6: Employee Applies for Leave            │
│   - Logs in with created credentials            │
│   - Applies for annual leave                    │
│   - Verifies status is "Pending Approval"       │
└────────────────┬────────────────────────────────┘
                 │
┌────────────────▼────────────────────────────────┐
│ Step 7-9: Supervisor Approves Leave             │
│   - Views pending leave requests                │
│   - Approves employee's leave                   │
│   - Verifies status changed to "Approved"       │
└────────────────┬────────────────────────────────┘
                 │
┌────────────────▼────────────────────────────────┐
│ Step 10-12: Admin Verifies Approved Leave       │
│   - Views approved leave in Leave List          │
│   - Uses Repository pattern to fetch data       │
│   - Validates data structure                    │
└─────────────────────────────────────────────────┘
```

## Test Data Persistence

Tests use `test-data.json` (created in project root) to share data:

```json
{
  "employee": {
    "firstName": "TestEmp1730131234567",
    "lastName": "Automation",
    "fullName": "TestEmp1730131234567 Automation",
    "employeeId": "0123"
  },
  "systemUser": {
    "username": "emp1730131234567",
    "password": "TestPass123!"
  },
  "supervisor": {
    "name": "Odis Adalwin",
    "assignedAt": "2025-10-28T10:30:00.000Z"
  },
  "leaveRequest": {
    "fromDate": "2025-11-02",
    "toDate": "2025-11-04",
    "comment": "Automation test - Annual leave request",
    "appliedAt": "2025-10-28T10:31:00.000Z",
    "approvedAt": "2025-10-28T10:32:00.000Z",
    "approvedBy": "Admin"
  },
  "createdAt": "2025-10-28T10:30:00.000Z"
}
```

## Troubleshooting

### Tests Skip or Fail

**Issue**: Tests are skipped with message "No employee data found"
**Solution**: Run tests in order starting from `admin.create-employee.spec.ts`

**Issue**: Supervisor login fails
**Solution**: The demo uses Admin as supervisor. Ensure credentials are correct in `.env`

### Selector Issues

**Issue**: Element not found errors
**Solution**: OrangeHRM UI may have changed. Check selectors in `src/selectors/` files

### Timing Issues

**Issue**: Tests fail due to timing
**Solution**: Increase timeout in `playwright.config.ts` or add more wait conditions

## Running Tests with Different Options

```bash
# Run in headed mode (see browser)
npm run test:headed

# Run with UI mode (interactive)
npm run test:ui

# Run specific test file
npx playwright test src/tests/admin.create-employee.spec.ts

# Run with specific browser
npx playwright test --project=chromium
npx playwright test --project=firefox
npx playwright test --project=webkit

# Run in debug mode
npx playwright test --debug

# Run and generate trace
npx playwright test --trace on
```

## Generating Failure Artifacts

To create failure screenshots and traces for submission:

1. Intentionally break a test (change an assertion)
2. Run the test: `npx playwright test`
3. Artifacts will be in `test-results/` folder
4. View trace: `npx playwright show-trace test-results/.../trace.zip`

## CI/CD Integration

The tests can be integrated into CI/CD pipelines:

```yaml
# Example GitHub Actions
- name: Install dependencies
  run: npm ci

- name: Install Playwright Browsers
  run: npx playwright install --with-deps

- name: Run tests
  run: npm test

- name: Upload report
  uses: actions/upload-artifact@v3
  if: always()
  with:
    name: playwright-report
    path: playwright-report/
```

## Best Practices

1. **Always run tests in sequence** - They depend on each other
2. **Check test-data.json** - Verify data persistence between tests
3. **Clean state** - Delete test-data.json before full test run
4. **Review HTML report** - Contains detailed execution information
5. **Check traces on failure** - Provides full timeline of actions

## Support

For issues or questions:
- Check the QUICK_REFERENCE.md for common commands
- Review TESTING_GUIDE.md for detailed testing strategies
- Examine IMPLEMENTATION_SUMMARY.md for architecture details
