import {Request} from "express";
import {AbstractRequest} from "../../abstract/abstract.request";

export class GetIssueRequest extends AbstractRequest {
  private _issueId: string;
  private _projectKey: string;

  constructor(request: Request) {
    super(request);
    this._issueId = request.params.issueId;
    this._projectKey = request.query.projectKey as string;
  }

  public get issueId(): string {
    return this._issueId;
  }

  public get projectKey(): string {
    return this._projectKey;
  }
}
