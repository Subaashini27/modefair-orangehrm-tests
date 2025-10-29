import { LeaveRequest } from "../models/LeaveRequest";

export interface ILeaveRepository {
  getLeaveRequests(employeeName?: string): Promise<LeaveRequest[]>;
  getLeaveRequestByEmployee(employeeName: string): Promise<LeaveRequest | null>;
}
