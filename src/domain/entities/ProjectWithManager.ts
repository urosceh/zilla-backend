import {IProject} from "../interfaces/IProject";
import {IUser} from "../interfaces/IUser";
import {Project} from "./Project";
import {User} from "./User";

export class ProjectWithManager extends Project {
  private _manager: User;

  constructor(project: IProject, manager: IUser) {
    super(project);
    this._manager = new User(manager);
  }
}
