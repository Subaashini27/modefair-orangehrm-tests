export enum LeaveType {
  ANNUAL_LEAVE = "CAN - FMLA",
  SICK_LEAVE = "CAN - Personal",
}

export enum LeaveStatus {
  PENDING_APPROVAL = "Pending Approval",
  APPROVED = "Approved",
  REJECTED = "Rejected",
  CANCELLED = "Cancelled",
}

export class LeaveRequest {
  readonly leaveType: LeaveType;
  readonly fromDate: Date;
  readonly toDate: Date;
  readonly comment?: string;
  readonly employeeName?: string;
  status: LeaveStatus;

  constructor(data: {
    leaveType: LeaveType;
    fromDate: Date;
    toDate: Date;
    comment?: string;
    employeeName?: string;
    status?: LeaveStatus;
  }) {
    if (!(data.fromDate instanceof Date) || isNaN(data.fromDate.getTime())) {
      throw new Error("Invalid from date");
    }
    if (!(data.toDate instanceof Date) || isNaN(data.toDate.getTime())) {
      throw new Error("Invalid to date");
    }
    if (data.fromDate > data.toDate) {
      throw new Error("From date cannot be after to date");
    }

    this.leaveType = data.leaveType;
    this.fromDate = data.fromDate;
    this.toDate = data.toDate;
    this.comment = data.comment;
    this.employeeName = data.employeeName;
    this.status = data.status || LeaveStatus.PENDING_APPROVAL;
  }

  formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  get fromDateFormatted(): string {
    return this.formatDate(this.fromDate);
  }

  get toDateFormatted(): string {
    return this.formatDate(this.toDate);
  }

  static createAnnualLeave(fromDate: Date, toDate: Date, comment?: string): LeaveRequest {
    return new LeaveRequest({
      leaveType: LeaveType.ANNUAL_LEAVE,
      fromDate,
      toDate,
      comment,
    });
  }
}
