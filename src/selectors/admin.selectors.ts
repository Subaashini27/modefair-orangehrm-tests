export const adminSelectors = {
  // Navigation
  adminMenu: 'a[href="/web/index.php/admin/viewAdminModule"]',
  userManagementMenu: '//span[text()="User Management "]',
  usersMenuItem: '//a[text()="Users"]',

  // Add User Form
  addButton: '//button[normalize-space()="Add"]',
  userRoleDropdown: '//label[text()="User Role"]/../..//div[contains(@class, "oxd-select-text")]',
  userRoleOption: (role: string) => `//div[@role="option"]//span[text()="${role}"]`,
  employeeNameInput: '//label[text()="Employee Name"]/../..//input',
  statusDropdown: '//label[text()="Status"]/../..//div[contains(@class, "oxd-select-text")]',
  statusOption: (status: string) => `//div[@role="option"]//span[text()="${status}"]`,
  usernameInput: '//label[text()="Username"]/../..//input',
  passwordInput: '//label[text()="Password"]/../..//input',
  confirmPasswordInput: '//label[text()="Confirm Password"]/../..//input',
  saveButton: 'button[type="submit"]',
  successToast: ".oxd-toast--success",

  // User List
  searchUsernameInput: '//label[text()="Username"]/../..//input',
  searchButton: 'button[type="submit"]',
  recordsFoundText: ".orangehrm-horizontal-padding span.oxd-text--span",

  // Autocomplete dropdown
  autocompleteOption: (name: string) => `//div[@role="option"]//span[contains(text(), "${name}")]`,
};
