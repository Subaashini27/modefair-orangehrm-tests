export class Employee {
  readonly firstName: string;
  readonly lastName: string;
  readonly middleName?: string;
  readonly employeeId?: string;

  constructor(data: {
    firstName: string;
    lastName: string;
    middleName?: string;
    employeeId?: string;
  }) {
    if (!data.firstName || data.firstName.trim().length === 0) {
      throw new Error("First name is required");
    }
    if (!data.lastName || data.lastName.trim().length === 0) {
      throw new Error("Last name is required");
    }

    this.firstName = data.firstName.trim();
    this.lastName = data.lastName.trim();
    this.middleName = data.middleName?.trim();
    this.employeeId = data.employeeId;
  }

  get fullName(): string {
    return this.middleName
      ? `${this.firstName} ${this.middleName} ${this.lastName}`
      : `${this.firstName} ${this.lastName}`;
  }

  static create(firstName: string, lastName: string, middleName?: string): Employee {
    return new Employee({ firstName, lastName, middleName });
  }
}
