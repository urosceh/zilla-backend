import {GetAllUsersRequest} from "../../api/user/get.all.users/get.all.users.request";
import {IUserProjectAccessRepository} from "../../database/repositories/user.project.access.repository";
import {ProjectWithManager} from "../entities/ProjectWithManager";
import {User} from "../entities/User";
import {UserProjectAccess} from "../entities/UserProjectAccess";
import {BadRequest, ForbiddenAccess} from "../errors/errors.index";

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

  public async getAllAccessableProjects(
    userId: string,
    options: {limit: number; offset: number; search?: string}
  ): Promise<ProjectWithManager[]> {
    return this._userProjectAccessRepository.getAllUsersProjects(userId, options);
  }

  public async getAllUsersOnProject(request: GetAllUsersRequest): Promise<User[]> {
    const projectKey = request.projectKey;

    if (!projectKey) {
      throw new BadRequest("Project key is required to get all users on a project");
    }

    const hasAccess = await this._userProjectAccessRepository.hasAccess(request.accessUserId, projectKey);

    if (!hasAccess) {
      throw new ForbiddenAccess("You don't have access to this project", {
        user: request.accessUserId,
        project: projectKey,
      });
    }

    return this._userProjectAccessRepository.getAllUsersOnProject(projectKey, request.options);
  }
}
