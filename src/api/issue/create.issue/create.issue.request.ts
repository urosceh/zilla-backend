import {Request} from "express";
import {IssueStatus} from "../../../domain/enums/IssueStatus";
import {IIssue} from "../../../domain/interfaces/IIssue";
import {AbstractRequest} from "../../abstract/abstract.request";

export class CreateIssueRequest extends AbstractRequest {
  private _projectKey: string;
  private _reporterId: string;
  private _issueStatus: IssueStatus;
  private _summary: string;
  private _assigneeId?: string | null;
  private _details?: string | null;
  private _sprintId?: number | null;

  constructor(request: Request) {
    super(request);
    this._projectKey = request.body.projectKey;
    this._reporterId = this.accessUserId;
    this._issueStatus = request.body.issueStatus;
    this._summary = request.body.summary;
    this._assigneeId = request.body.assigneeId;
    this._details = request.body.details;
    this._sprintId = request.body.sprintId;
  }

  public get issue(): IIssue {
    return {
      projectKey: this._projectKey,
      reporterId: this._reporterId,
      issueStatus: this._issueStatus,
      summary: this._summary,
      assigneeId: this._assigneeId || null,
      sprintId: this._sprintId || null,
      details: this._details || null,
    };
  }
}
