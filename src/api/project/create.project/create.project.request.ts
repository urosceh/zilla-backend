import {Request} from "express";

export class CreateProjectRequest {
  private _projectName: string;
  private _projectKey: string;
  private _managerId: string;

  constructor(request: Request) {
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
