import IssueModel from "../../database/models/issue.model";
import {IssueStatus} from "../enums/IssueStatus";
import {IDtoable} from "../interfaces/IReturnable";
import {Project} from "./Project";
import {Sprint} from "./Sprint";
import {User} from "./User";

export class Issue implements IDtoable {
  private _issueId: string;
  private _projectId: string;
  private _reporterId: string;
  private _assigneeId: string | null;
  private _sprintId: number | null;
  private _issueStatus: IssueStatus;
  private _summary: string;
  private _details: string | null;
  private _createdAt: Date;
  private _updatedAt: Date;
  private _deletedAt: Date | null;
  private _project: Project | undefined;
  private _reporter: User | undefined;
  private _assignee: User | null | undefined;
  private _sprint: Sprint | null | undefined;

  constructor(issue: IssueModel) {
    this._issueId = issue.issueId;
    this._projectId = issue.projectId;
    this._reporterId = issue.reporterId;
    this._assigneeId = issue.assigneeId;
    this._sprintId = issue.sprintId;
    this._issueStatus = issue.issueStatus;
    this._summary = issue.summary;
    this._details = issue.details;

    this._project = issue.project ? new Project(issue.project) : undefined;
    this._reporter = issue.reporter ? new User(issue.reporter) : undefined;
    this._assignee = issue.assignee ? new User(issue.assignee) : undefined;
    this._sprint = issue.sprint ? new Sprint(issue.sprint) : issue.sprint;

    this._createdAt = issue.createdAt;
    this._updatedAt = issue.updatedAt;
    this._deletedAt = issue.deletedAt;
  }

  public createDto() {
    return {
      issueId: this._issueId,
      projectId: this._projectId,
      reporter: this._reporter?.createDto(),
      assignee: this._assignee?.createDto(),
      sprint: this._sprint?.createDto(),
      issueStatus: this._issueStatus,
      summary: this._summary,
      details: this._details,
      createdAt: this._createdAt,
      updatedAt: this._updatedAt,
      deletedAt: this._deletedAt,
    };
  }
}
