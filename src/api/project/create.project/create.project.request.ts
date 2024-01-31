import {Request} from "express";
import {AbstractRequest} from "../../abstract/abstract.request";

export class CreateProjectRequest extends AbstractRequest {
  private _projectName: string;
  private _projectKey: string;
  private _managerId: string;

  constructor(request: Request) {
    super(request);
    this._projectName = request.body.projectName;
    this._projectKey = request.body.projectKey;
    this._managerId = request.body.managerId;
  }

  get projectName(): string {
    return this._projectName;
  }

  get projectKey(): string {
    return this._projectKey;
  }

  get managerId(): string {
    return this._managerId;
  }
}
