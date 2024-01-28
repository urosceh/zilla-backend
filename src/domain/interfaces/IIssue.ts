import {ITimestampable} from "./ITimestampable";

export interface IIssue extends ITimestampable {
  issueId?: string;
  projectId: string;
  reporterId: string;
  assigneeId: string | null;
  statusId: number | null;
  sprintId: number | null;
  summary: string;
  details: string | null;
}
