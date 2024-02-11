import {IssueStatus} from "../enums/IssueStatus";

export interface IIssue {
  projectKey: string;
  reporterId: string;
  issueStatus: IssueStatus;
  summary: string;
  assigneeId: string | null;
  details: string | null;
  sprintId: number | null;
}
