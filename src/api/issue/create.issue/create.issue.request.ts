import {Request} from "express";
import {IssueStatus} from "../../../domain/enums/IssueStatus";
import {IIssue} from "../../../domain/interfaces/IIssue";
import {AbstractRequest} from "../../abstract/abstract.request";

export class CreateIssueRequest extends AbstractRequest {
  private _projectId: string;
  private _reporterId: string;
  private _issueStatus: IssueStatus;
  private _summary: string;
  private _assigneeId?: string | null;
  private _details?: string | null;
  private _sprintId?: number | null;

  constructor(request: Request) {
    super(request);
    this._projectId = request.body.projectId;
    this._reporterId = request.body.reporterId;
    this._issueStatus = request.body.issueStatus;
    this._summary = request.body.summary;
    this._assigneeId = request.body.assigneeId;
    this._details = request.body.details;
    this._sprintId = request.body.sprintId;
  }

  public get issue(): IIssue {
    return {
      projectId: this._projectId,
      reporterId: this._reporterId,
      issueStatus: this._issueStatus,
      summary: this._summary,
      assigneeId: this._assigneeId || null,
      sprintId: this._sprintId || null,
      details: this._details || null,
    };
  }
}
