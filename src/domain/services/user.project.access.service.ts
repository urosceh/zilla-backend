import {GetAllProjectsRequest} from "../../api/project/get.all.projects/get.all.projects.request";
import {GetAllUsersRequest} from "../../api/user/get.all.users/get.all.users.request";
import {IUserProjectAccessRepository} from "../../database/repositories/user.project.access.repository";
import {TransactionManager} from "../../database/transaction.manager";
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

  public async getAllAccessableProjects(request: GetAllProjectsRequest): Promise<ProjectWithManager[]> {
    const transaction = await TransactionManager.createTenantTransaction(request.tenantSchemaName);

    return this._userProjectAccessRepository.getAllUsersProjects(request.accessUserId, request.options, transaction);
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
