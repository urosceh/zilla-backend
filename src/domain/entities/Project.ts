import ProjectModel from "../../database/models/project.model";
import {IProject} from "../interfaces/IProject";

export class Project {
  private _projectId: string;
  private _projectName: string;
  private _projectKey: string;
  private _managerId: string;
  private _createdAt: Date;
  private _updatedAt: Date;
  private _deletedAt: Date | null;

  constructor(project: ProjectModel) {
    this._projectId = project.projectId;
    this._projectName = project.projectName;
    this._projectKey = project.projectKey;
    this._managerId = project.managerId;
    this._createdAt = project.createdAt;
    this._updatedAt = project.updatedAt;
    this._deletedAt = project.deletedAt;
  }
}
