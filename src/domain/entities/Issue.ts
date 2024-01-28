import {IssueWithDetails} from "../types/IssueWithDetails";
import {Sprint} from "./Sprint";
import {Status} from "./Status";
import {User} from "./User";

export class Issue {
  private _issueId: string | null;
  private _projectId: string;
  private _reporter: User;
  private _assignee: User | null;
  private _sprint: Sprint | null;
  private _status: Status;
  private _summary: string;
  private _details: string | null;
  private _createdAt?: Date;
  private _updatedAt?: Date;
  private _deletedAt?: Date;

  constructor(issue: IssueWithDetails) {
    this._issueId = issue.issueId || null;
    this._projectId = issue.projectId;
    this._reporter = new User(issue.reporter);
    this._assignee = new User(issue.assignee);
    this._sprint = new Sprint(issue.sprint);
    this._status = new Status(issue.status);
    this._summary = issue.summary;
    this._details = issue.details;
    this._createdAt = issue.createdAt;
    this._updatedAt = issue.updatedAt;
    this._deletedAt = issue.deletedAt;
  }
}
