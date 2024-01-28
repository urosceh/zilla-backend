import {Request} from "express";
import {Project} from "../../../domain/entities/Project";

export class CreateProjectRequest {
  private _projectName: string;
  private _projectKey: string;
  private _managerId: string;

  constructor(request: Request) {
    this._projectName = request.body.projectName;
    this._projectKey = request.body.projectKey;
    this._managerId = request.body.managerId;
  }

  get project(): Project {
    return new Project({
      projectName: this._projectName,
      projectKey: this._projectKey,
      managerId: this._managerId,
    });
  }
}
