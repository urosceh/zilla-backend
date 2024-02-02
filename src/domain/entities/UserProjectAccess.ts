import UserProjectAccessModel from "../../database/models/user.project.access.model";
import {Project} from "./Project";
import {User} from "./User";

export class UserProjectAccess {
  private _userId: string;
  private _projectKey: string;
  private _project: Project;
  private _user?: User;

  constructor(userProjectAccess: UserProjectAccessModel) {
    this._userId = userProjectAccess.userId;
    this._projectKey = userProjectAccess.projectKey;
    this._user = userProjectAccess.user ? new User(userProjectAccess.user) : undefined;
    this._project = new Project(userProjectAccess.project);
  }

  public get project(): Project {
    return this._project;
  }
}
