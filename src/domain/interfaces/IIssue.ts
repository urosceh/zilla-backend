import {IssueStatus} from "../enums/IssueStatus";
import {ITimestampable} from "./ITimestampable";

export interface IIssue extends ITimestampable {
  projectId: string;
  reporterId: string;
  issueStatus: IssueStatus;
  summary: string;
  assigneeId: string | null;
  details: string | null;
  sprintId: number | null;
}
