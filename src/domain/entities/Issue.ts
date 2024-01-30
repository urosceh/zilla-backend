import IssueModel from "../../database/models/issue.model";
import {IssueStatus} from "./IssueStatus";
import {Sprint} from "./Sprint";
import {User} from "./User";

export class Issue {
  private _issueId: string;
  private _projectId: string;
  private _reporter: User | undefined;
  private _assignee: User | null | undefined;
  private _sprint: Sprint | null | undefined;
  private _status: IssueStatus;
  private _summary: string;
  private _details: string | null;
  private _createdAt: Date;
  private _updatedAt: Date;
  private _deletedAt: Date | null;

  constructor(issue: IssueModel) {
    this._issueId = issue.issueId;
    this._projectId = issue.projectId;
    this._reporter = issue.reporter ? new User(issue.reporter) : undefined;
    this._assignee = issue.assignee ? new User(issue.assignee) : undefined;
    this._sprint = issue.sprint ? new Sprint(issue.sprint) : issue.sprint;
    this._status = issue.issueStatus;
    this._summary = issue.summary;
    this._details = issue.details;
    this._createdAt = issue.createdAt;
    this._updatedAt = issue.updatedAt;
    this._deletedAt = issue.deletedAt;
  }
}
