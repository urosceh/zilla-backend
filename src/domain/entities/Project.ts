import {IProject} from "../interfaces/IProject";

export class Project {
  private _projectId: string | null;
  private _projectName: string;
  private _projectKey: string;
  private _managerId: string;
  private _createdAt: Date;
  private _updatedAt: Date;
  private _deletedAt: Date | null;

  constructor(project: IProject) {
    this._projectId = project.projectId || null;
    this._projectName = project.projectName;
    this._projectKey = project.projectKey;
    this._managerId = project.managerId;
    this._createdAt = project.createdAt!;
    this._updatedAt = project.updatedAt!;
    this._deletedAt = project.deletedAt || null;
  }

  public getForCreate(): IProject {
    return {
      projectName: this._projectName,
      projectKey: this._projectKey,
      managerId: this._managerId,
    };
  }
}
