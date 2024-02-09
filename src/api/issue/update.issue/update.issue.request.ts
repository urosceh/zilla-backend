import {Request} from "express";
import {IIssue} from "../../../domain/interfaces/IIssue";
import {AbstractRequest} from "../../abstract/abstract.request";

export class UpdateIssueRequest extends AbstractRequest {
  private _issueId: string;
  private _updateIssue: Partial<IIssue>;

  constructor(request: Request) {
    super(request);
    this._issueId = request.params.issueId;
    this._updateIssue = request.body;
  }

  get issueId() {
    return this._issueId;
  }

  get issue() {
    return this._updateIssue;
  }
}
