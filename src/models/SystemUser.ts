export enum UserRole {
  ADMIN = "Admin",
  ESS = "ESS",
}

export enum UserStatus {
  ENABLED = "Enabled",
  DISABLED = "Disabled",
}

export class SystemUser {
  readonly userRole: UserRole;
  readonly employeeName: string;
  readonly status: UserStatus;
  readonly username: string;
  readonly password: string;

  constructor(data: {
    userRole: UserRole;
    employeeName: string;
    status: UserStatus;
    username: string;
    password: string;
  }) {
    if (!data.username || data.username.trim().length < 5) {
      throw new Error("Username must be at least 5 characters");
    }
    if (!data.password || data.password.length < 7) {
      throw new Error("Password must be at least 7 characters");
    }
    if (!data.employeeName || data.employeeName.trim().length === 0) {
      throw new Error("Employee name is required");
    }

    this.userRole = data.userRole;
    this.employeeName = data.employeeName.trim();
    this.status = data.status;
    this.username = data.username.trim();
    this.password = data.password;
  }

  static createESSUser(employeeName: string, username: string, password: string): SystemUser {
    return new SystemUser({
      userRole: UserRole.ESS,
      employeeName,
      status: UserStatus.ENABLED,
      username,
      password,
    });
  }
}
