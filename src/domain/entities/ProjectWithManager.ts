import ProjectModel from "../../database/models/project.model";
import {IDtoable} from "../interfaces/IReturnable";
import {Project} from "./Project";
import {User} from "./User";

export class ProjectWithManager extends Project implements IDtoable {
  private _manager: User | undefined;

  constructor(project: ProjectModel) {
    super(project);
    this._manager = project.manager ? new User(project.manager) : undefined;
  }

  public createDto() {
    return {
      ...super.createDto(),
      manager: this._manager?.createDto(),
    };
  }

  get manager(): User | undefined {
    return this._manager;
  }
}
