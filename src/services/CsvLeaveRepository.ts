import * as fs from "fs";
import { ILeaveRepository } from "./ILeaveRepository";
import { LeaveRequest, LeaveType, LeaveStatus } from "../models/LeaveRequest";

export class CsvLeaveRepository implements ILeaveRepository {
  constructor(private csvFilePath: string) {}

  async getLeaveRequests(employeeName?: string): Promise<LeaveRequest[]> {
    if (!fs.existsSync(this.csvFilePath)) {
      throw new Error(`CSV file not found: ${this.csvFilePath}`);
    }

    const csvContent = fs.readFileSync(this.csvFilePath, "utf-8");
    const lines = csvContent.split("\n").filter((line) => line.trim());

    if (lines.length === 0) return [];

    // Skip header row
    const dataLines = lines.slice(1);
    const leaveRequests: LeaveRequest[] = [];

    for (const line of dataLines) {
      const columns = this.parseCsvLine(line);

      if (columns.length >= 6) {
        const empName = columns[1].trim();
        const leaveType = columns[2].trim();
        const fromDateStr = columns[3].trim();
        const toDateStr = columns[4].trim();
        const status = columns[5].trim();

        // Filter by employee name if provided
        if (employeeName && !empName.includes(employeeName)) {
          continue;
        }

        leaveRequests.push(
          new LeaveRequest({
            leaveType: this.mapLeaveType(leaveType),
            fromDate: new Date(fromDateStr),
            toDate: new Date(toDateStr),
            employeeName: empName,
            status: this.mapLeaveStatus(status),
          })
        );
      }
    }

    return leaveRequests;
  }

  async getLeaveRequestByEmployee(employeeName: string): Promise<LeaveRequest | null> {
    const requests = await this.getLeaveRequests(employeeName);
    return requests.length > 0 ? requests[0] : null;
  }

  private parseCsvLine(line: string): string[] {
    const result: string[] = [];
    let current = "";
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
      const char = line[i];

      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === "," && !inQuotes) {
        result.push(current);
        current = "";
      } else {
        current += char;
      }
    }

    result.push(current);
    return result;
  }

  private mapLeaveType(type: string): LeaveType {
    if (type.includes("FMLA")) return LeaveType.ANNUAL_LEAVE;
    if (type.includes("Personal")) return LeaveType.SICK_LEAVE;
    return LeaveType.ANNUAL_LEAVE;
  }

  private mapLeaveStatus(status: string): LeaveStatus {
    if (status.includes("Pending")) return LeaveStatus.PENDING_APPROVAL;
    if (status.includes("Approved")) return LeaveStatus.APPROVED;
    if (status.includes("Rejected")) return LeaveStatus.REJECTED;
    if (status.includes("Cancelled")) return LeaveStatus.CANCELLED;
    return LeaveStatus.PENDING_APPROVAL;
  }
}
