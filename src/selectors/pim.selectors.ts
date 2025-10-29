export const pimSelectors = {
  // Navigation
  pimMenu: 'a[href="/web/index.php/pim/viewPimModule"]',
  addEmployeeTab: 'a[href="/web/index.php/pim/addEmployee"]',
  employeeListTab: 'a[href="/web/index.php/pim/viewEmployeeList"]',

  // Add Employee Form
  firstNameInput: 'input[name="firstName"]',
  middleNameInput: 'input[name="middleName"]',
  lastNameInput: 'input[name="lastName"]',
  employeeIdInput: '//label[text()="Employee Id"]/../..//input',
  createLoginToggle: '//span[contains(@class, "oxd-switch-input")]',
  usernameInput: '//label[text()="Username"]/../..//input',
  passwordInput: '//label[text()="Password"]/../..//input',
  confirmPasswordInput: '//label[text()="Confirm Password"]/../..//input',
  saveButton: 'button[type="submit"]',
  successToast: ".oxd-toast--success",

  // Employee List
  searchEmployeeNameInput: '//label[text()="Employee Name"]/../..//input',
  searchButton: 'button[type="submit"]',
  recordsFoundText: ".orangehrm-horizontal-padding span.oxd-text--span",
  employeeNameLink: (name: string) =>
    `//div[contains(@class, "oxd-table-cell") and text()="${name}"]`,

  // Report-to tab
  reportToTab: '//a[text()="Report-to"]',
  addSupervisorButton: '//h6[text()="Assigned Supervisors"]/following::button[1]',
  supervisorNameInput: '//label[text()="Name"]/../..//input',
  reportingMethodDropdown:
    '//label[text()="Reporting Method"]/../..//div[contains(@class, "oxd-select-text")]',
  reportingMethodOption: (method: string) => `//div[@role="option" and text()="${method}"]`,
  supervisorSaveButton: 'button[type="submit"]',
  supervisorSuccessToast: ".oxd-toast--success",

  // Autocomplete dropdown
  autocompleteOption: (name: string) => `//div[@role="option"]//span[contains(text(), "${name}")]`,
};
