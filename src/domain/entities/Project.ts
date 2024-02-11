import ProjectModel from "../../database/models/project.model";
import {IDtoable} from "../interfaces/IReturnable";

export class Project implements IDtoable {
  private _projectId: number;
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

  public toDto() {
    return {
      projectId: this._projectId,
      projectName: this._projectName,
      projectKey: this._projectKey,
      managerId: this._managerId,
      createdAt: this._createdAt,
      updatedAt: this._updatedAt,
    };
  }

  get projectKey(): string {
    return this._projectKey;
  }

  get managerId(): string {
    return this._managerId;
  }
}
