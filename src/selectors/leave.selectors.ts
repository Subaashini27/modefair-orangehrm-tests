export const leaveSelectors = {
  // Navigation
  leaveMenu: 'a[href="/web/index.php/leave/viewLeaveModule"]',
  applyTab: 'a[href="/web/index.php/leave/applyLeave"]',
  myLeaveTab: 'a[href="/web/index.php/leave/viewMyLeaveList"]',
  leaveListTab: 'a[href="/web/index.php/leave/viewLeaveList"]',

  // Apply Leave Form
  leaveTypeDropdown: '//label[text()="Leave Type"]/../..//div[contains(@class, "oxd-select-text")]',
  leaveTypeOption: (type: string) => `//div[@role="option"]//span[contains(text(), "${type}")]`,
  fromDateInput: '//label[text()="From Date"]/../..//input',
  toDateInput: '//label[text()="To Date"]/../..//input',
  commentsTextarea: 'textarea[placeholder="Type comment here"]',
  applyButton: 'button[type="submit"]',
  successToast: ".oxd-toast--success",

  // My Leave / Leave List
  employeeNameInput: '//label[text()="Employee Name"]/../..//input',
  fromDateFilter: '//label[text()="From Date"]/../..//input',
  toDateFilter: '//label[text()="To Date"]/../..//input',
  statusDropdown:
    '//label[contains(text(), "Show Leave with Status")]/../..//div[contains(@class, "oxd-select-text")]',
  statusOption: (status: string) => `//div[@role="option"]//span[text()="${status}"]`,
  searchButton: 'button[type="submit"]',

  // Leave Table
  leaveTableRow: ".oxd-table-body .oxd-table-card",
  leaveStatusCell: (row: number) =>
    `(//div[contains(@class, "oxd-table-card")])[${row}]//div[contains(@class, "oxd-table-cell")][6]`,
  leaveEmployeeNameCell: (row: number) =>
    `(//div[contains(@class, "oxd-table-card")])[${row}]//div[contains(@class, "oxd-table-cell")][2]`,
  approveButton: (row: number) =>
    `(//div[contains(@class, "oxd-table-card")])[${row}]//button[contains(@class, "oxd-icon-button")]//i[contains(@class, "bi-check")]`,
  recordsFoundText: ".orangehrm-horizontal-padding span.oxd-text--span",

  // Actions
  actionButton: '//button[contains(@class, "oxd-icon-button")]',
  approveIcon: '//i[contains(@class, "bi-check")]',

  // Autocomplete
  autocompleteOption: (name: string) => `//div[@role="option"]//span[contains(text(), "${name}")]`,
};
