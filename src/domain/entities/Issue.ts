import IssueModel from "../../database/models/issue.model";
import {IssueStatus} from "../enums/IssueStatus";
import {Sprint} from "./Sprint";
import {User} from "./User";

export class Issue {
  private _issueId: string;
  private _projectId: string;
  private _reporter: User | undefined;
  private _assignee: User | null | undefined;
  private _sprint: Sprint | null | undefined;
  private _issueStatus: IssueStatus;
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
    this._issueStatus = issue.issueStatus;
    this._summary = issue.summary;
    this._details = issue.details;
    this._createdAt = issue.createdAt;
    this._updatedAt = issue.updatedAt;
    this._deletedAt = issue.deletedAt;
  }

  get issueId(): string {
    return this._issueId;
  }

  get projectId(): string {
    return this._projectId;
  }

  get reporter(): User | undefined {
    return this._reporter;
  }

  get assignee(): User | null | undefined {
    return this._assignee;
  }

  get sprint(): Sprint | null | undefined {
    return this._sprint;
  }

  get issueStatus(): IssueStatus {
    return this._issueStatus;
  }

  get summary(): string {
    return this._summary;
  }

  get details(): string | null {
    return this._details;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  get deletedAt(): Date | null {
    return this._deletedAt;
  }
}
