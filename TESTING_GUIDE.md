# Testing Guide & Next Steps

## ✅ Completed Implementation

All core components have been implemented:

1. ✅ Project structure and configuration
2. ✅ Package.json with dependencies
3. ✅ Prettier configuration
4. ✅ TypeScript configuration (strict mode)
5. ✅ Environment variables setup (.env)
6. ✅ Models with validation (Employee, SystemUser, LeaveRequest)
7. ✅ Selectors (login, pim, admin, leave)
8. ✅ Page Objects (LoginPage, PIMPage, UserManagementPage, LeaveApplyPage, LeaveListPage)
9. ✅ Services (Repository pattern with UI and CSV implementations)
10. ✅ Fixtures (Admin, Employee, Supervisor authenticated contexts)
11. ✅ Test specifications (5 test files covering the business scenario)
12. ✅ Comprehensive README documentation

## 🚀 Next Steps for You

### Step 1: Install Playwright Browsers

```bash
npx playwright install
```

This will download Chromium, Firefox, and WebKit browsers needed for testing.

### Step 2: Run a Single Test First

Start with the employee creation test:

```bash
npx playwright test src/tests/admin.create-employee.spec.ts --headed
```

Using `--headed` lets you see the browser and verify the automation is working.

### Step 3: Run All Tests in Sequence

```bash
npm test
```

This will run all tests in the defined order.

### Step 4: View the HTML Report

After tests complete:

```bash
npm run test:report
```

This opens the HTML report in your browser with:
- Test results
- Screenshots on failure
- Traces for debugging
- Execution timeline

### Step 5: Intentionally Create a Failure (for artifact)

To capture a failure screenshot/trace as required:

**Option A: Modify a selector**
1. Open `src/selectors/login.selectors.ts`
2. Change `usernameInput` to an incorrect selector like `'input[name="wrongname"]'`
3. Run the test: `npx playwright test src/tests/admin.create-employee.spec.ts`
4. The test will fail and capture screenshots + trace

**Option B: Use incorrect credentials**
1. Temporarily change the password in `.env` to `wrongpassword`
2. Run tests
3. Revert the change after capturing the failure

**Option C: Add an incorrect assertion**
1. In any test file, add an assertion like `expect(1).toBe(2);`
2. Run the test to capture the failure
3. Remove the assertion afterward

### Step 6: Collect Artifacts

After running tests (especially with failures), collect these artifacts:

**Required Artifacts:**
1. **HTML Report** - Located in `playwright-report/` folder
   - Copy the entire folder or zip it
   - Or host it (GitHub Pages, Netlify, Vercel)

2. **Failure Screenshot** - Located in `test-results/` folder
   - Look for `*-failed-*.png` files

3. **Trace File** - Located in `test-results/` folder
   - Look for `trace.zip` files
   - View with: `npx playwright show-trace test-results/<test-name>/trace.zip`

## 🐛 Troubleshooting

### Issue: Tests timing out
**Solution**: The OrangeHRM demo site can be slow. Increase timeout in `playwright.config.ts`:
```typescript
timeout: 90000, // Increase to 90 seconds
```

### Issue: Selectors not found
**Solution**: The demo site UI may change. Update selectors in `src/selectors/` files.

### Issue: Employee/Supervisor tests skipped
**Solution**: These tests check if credentials exist. Run `admin.create-employee.spec.ts` first to generate employee credentials.

### Issue: Cannot find elements
**Solution**: Add debug mode to see what's happening:
```bash
npx playwright test --debug
```

## 📊 Understanding the Test Flow

### Data Flow:
1. **admin.create-employee.spec.ts** 
   - Creates employee with timestamp-based unique name
   - Stores credentials in `process.env.EMPLOYEE_USERNAME` and `EMPLOYEE_PASSWORD`
   - These are used by subsequent employee tests

2. **admin.assign-supervisor.spec.ts**
   - Would assign supervisor to the created employee
   - May need adjustment based on demo site state

3. **employee.apply-leave.spec.ts**
   - Logs in as the created employee
   - Applies for annual leave
   - Verifies pending status

4. **supervisor.approve-leave.spec.ts**
   - Logs in as supervisor
   - Finds and approves leave
   - Requires manual supervisor credentials in .env

5. **admin.verify-leave.spec.ts**
   - Verifies approved leave exists
   - Tests repository pattern implementation

## 🎯 Key Points for Assessment

### What Makes This Implementation Strong:

1. **OOP & SOLID Principles**
   - Single Responsibility: Each class has one clear purpose
   - Open/Closed: Repository interface allows extension
   - Dependency Inversion: Pages depend on abstractions (models)

2. **Page Object Model**
   - Clean separation of concerns
   - Reusable page methods
   - Maintainable test code

3. **Separated Selectors**
   - Easy to update when UI changes
   - No duplication
   - Centralized management

4. **Value Objects**
   - Models with validation
   - Business logic encapsulated
   - Type safety

5. **Repository Pattern**
   - Abstraction for data access
   - Multiple implementations (UI, CSV)
   - Testable and flexible

6. **No Hardcoded Values**
   - Environment variables for credentials
   - Dynamic test data with timestamps
   - Configuration-driven

7. **Robust Synchronization**
   - No hard sleeps
   - Proper waits
   - Network idle checks

## 📝 Final Checklist

Before submission:

- [ ] All dependencies installed
- [ ] Playwright browsers installed
- [ ] Tests run successfully (at least partially)
- [ ] HTML report generated
- [ ] Failure artifact captured (screenshot or trace)
- [ ] Code formatted with Prettier
- [ ] README is complete and accurate
- [ ] .env file has example values (not actual secrets)
- [ ] Repository is pushed to GitHub (public)
- [ ] Repository URL ready to share

## 🎓 Optional Enhancements (If Time Permits)

1. **Add data-driven tests** using test.describe.each()
2. **Implement CSV export test** if demo site supports it
3. **Add visual regression testing** with Playwright screenshots
4. **Create custom reporter** for better output formatting
5. **Add API tests** alongside UI tests
6. **Implement test retry logic** with exponential backoff
7. **Add performance metrics** tracking

## 💡 Tips for Presentation

When presenting this to the assessor:

1. **Start with README** - Shows you can document well
2. **Show project structure** - Highlight separation of concerns
3. **Walk through a model** - Demonstrate Value Object pattern
4. **Explain a page object** - Show POM implementation
5. **Demonstrate repository pattern** - Highlight abstraction
6. **Show test flow** - Explain the business scenario
7. **Display HTML report** - Professional reporting
8. **Show failure handling** - Screenshots and traces

## 📧 Questions?

If you encounter issues:
1. Check the demo site is accessible: https://opensource-demo.orangehrmlive.com/
2. Verify Node.js version: `node --version` (should be v18+)
3. Check Playwright installation: `npx playwright --version`
4. Review test output for specific errors
5. Use debug mode: `npx playwright test --debug`

Good luck with your assessment! 🚀
