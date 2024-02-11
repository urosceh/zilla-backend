import {Request} from "express";
import {AbstractRequest} from "../../abstract/abstract.request";

export class GetProjectSprintsRequest extends AbstractRequest {
  private _projectKey: string;

  constructor(request: Request) {
    super(request);
    this._projectKey = request.params.projectKey;
  }

  get projectKey() {
    return this._projectKey;
  }
}
