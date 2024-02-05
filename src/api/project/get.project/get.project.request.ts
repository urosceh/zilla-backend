import {Request} from "express";
import {AbstractRequest} from "../../abstract/abstract.request";

export class GetProjectRequest extends AbstractRequest {
  private _projectKey: string;

  constructor(request: Request) {
    super(request);
    this._projectKey = request.params.projectKey as string;
  }

  get projectKey(): string {
    return this._projectKey;
  }
}
