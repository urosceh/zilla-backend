import ProjectModel from "../../database/models/project.model";
import {IDtoable} from "../interfaces/IReturnable";
import {Project} from "./Project";
import {User} from "./User";

export class ProjectWithManager extends Project implements IDtoable {
  private _manager: User | undefined;
  private _isManager: boolean = false;

  constructor(project: ProjectModel) {
    super(project);
    this._manager = project.manager ? new User(project.manager) : undefined;
  }

  public toDto() {
    const response = {
      ...super.toDto(),
      manager: this._manager?.toDto(),
      isManager: this._isManager,
    };

    if (this._isManager) {
      Object.assign(response, {isManager: this._isManager});
    }

    return response;
  }

  get manager(): User | undefined {
    return this._manager;
  }

  get isManager(): boolean {
    return this._isManager;
  }

  set isManager(value: boolean) {
    this._isManager = value;
  }
}
