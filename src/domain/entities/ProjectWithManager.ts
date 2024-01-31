import ProjectModel from "../../database/models/project.model";
import {Project} from "./Project";
import {User} from "./User";

export class ProjectWithManager extends Project {
  private _manager: User | undefined;

  constructor(project: ProjectModel) {
    super(project);
    this._manager = project.manager ? new User(project.manager) : undefined;
  }

  get manager(): User | undefined {
    return this._manager;
  }
}
