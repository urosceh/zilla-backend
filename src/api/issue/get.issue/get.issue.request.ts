import {AbstractRequest} from "../../abstract/abstract.request";
import {Request} from "express";

export class GetIssueRequest extends AbstractRequest {
  private _issueId: string;
  private _projectId: string;

  constructor(request: Request) {
    super(request);
    this._issueId = request.params.issueId;
    this._projectId = request.query.projectId as string;
  }

  public get issueId(): string {
    return this._issueId;
  }

  public get projectId(): string {
    return this._projectId;
  }
}
