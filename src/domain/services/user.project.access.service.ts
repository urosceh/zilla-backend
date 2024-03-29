import {IUserProjectAccessRepository} from "../../database/repositories/user.project.access.repository";
import {ProjectWithManager} from "../entities/ProjectWithManager";
import {User} from "../entities/User";
import {UserProjectAccess} from "../entities/UserProjectAccess";
import {IPaginatable} from "../interfaces/IPaginatable";

export class UserProjectAccessService {
  constructor(private _userProjectAccessRepository: IUserProjectAccessRepository) {}

  public async getUserProjectAccess(userId: string, projectKey: string): Promise<UserProjectAccess> {
    return this._userProjectAccessRepository.getUserProjectAccess(userId, projectKey);
  }

  public async giveProjectAccessToUsers(userIds: string[], projectKey: string): Promise<void> {
    return this._userProjectAccessRepository.insertAccess(userIds, projectKey);
  }

  public async revokeProjectAccessFromUsers(userIds: string[], projectKey: string): Promise<void> {
    return this._userProjectAccessRepository.deleteAccess(userIds, projectKey);
  }

  public async hasAccessToProject(userId: string, projectKey: string): Promise<boolean> {
    return this._userProjectAccessRepository.hasAccess(userId, projectKey);
  }

  public async getAllAccessableProjects(
    userId: string,
    options: {limit: number; offset: number; search?: string}
  ): Promise<ProjectWithManager[]> {
    return this._userProjectAccessRepository.getAllUsersProjects(userId, options);
  }

  public async getAllUsersOnProject(projectKey: string, options: IPaginatable): Promise<User[]> {
    return this._userProjectAccessRepository.getAllUsersOnProject(projectKey, options);
  }
}
