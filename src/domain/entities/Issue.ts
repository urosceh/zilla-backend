import IssueModel from "../../database/models/issue.model";
import {Sprint} from "./Sprint";
import {Status} from "./Status";
import {User} from "./User";

export class Issue {
  private _issueId: string;
  private _projectId: string;
  private _reporter: User | undefined;
  private _assignee: User | null;
  private _sprint: Sprint | null;
  private _status: Status | undefined;
  private _summary: string;
  private _details: string | null;
  private _createdAt: Date;
  private _updatedAt: Date;
  private _deletedAt: Date | null;

  constructor(issue: IssueModel) {
    this._issueId = issue.issueId;
    this._projectId = issue.projectId;
    this._reporter = issue.reporter ? new User(issue.reporter) : undefined;
    this._assignee = issue.assignee ? new User(issue.assignee) : null;
    this._sprint = issue.sprint ? new Sprint(issue.sprint) : null;
    this._status = issue.issueStatus ? new Status(issue.issueStatus) : undefined;
    this._summary = issue.summary;
    this._details = issue.details;
    this._createdAt = issue.createdAt;
    this._updatedAt = issue.updatedAt;
    this._deletedAt = issue.deletedAt;
  }
}
