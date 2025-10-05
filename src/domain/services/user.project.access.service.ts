import {GetAllProjectsRequest} from "../../api/project/get.all.projects/get.all.projects.request";
import {ManageAccessRequest} from "../../api/user.project.access/manage.access/manage.access.request";
import {GetAllUsersRequest} from "../../api/user/get.all.users/get.all.users.request";
import {IUserProjectAccessRepository} from "../../database/repositories/user.project.access.repository";
import {TransactionManager} from "../../database/transaction.manager";
import {ProjectWithManager} from "../entities/ProjectWithManager";
import {User} from "../entities/User";
import {UserProjectAccess} from "../entities/UserProjectAccess";
import {BadRequest, ForbiddenAccess} from "../errors/errors.index";

export class UserProjectAccessService {
  constructor(private _userProjectAccessRepository: IUserProjectAccessRepository) {}

  public async giveProjectAccessToUsers(request: ManageAccessRequest): Promise<void> {
    const transaction = await TransactionManager.createTenantTransaction(request.tenantId);

    try {
      await this._userProjectAccessRepository.insertAccess(request.userIds, request.projectKey, transaction);
      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  public async revokeProjectAccessFromUsers(request: ManageAccessRequest): Promise<void> {
    const transaction = await TransactionManager.createTenantTransaction(request.tenantId);

    try {
      await this._userProjectAccessRepository.deleteAccess(request.userIds, request.projectKey, transaction);
      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  public async getAllAccessableProjects(request: GetAllProjectsRequest): Promise<ProjectWithManager[]> {
    const transaction = await TransactionManager.createTenantTransaction(request.tenantId);

    try {
      const projects = await this._userProjectAccessRepository.getAllUsersProjects(request.accessUserId, request.options, transaction);
      await transaction.commit();
      return projects;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  public async getUserProjectAccess(userId: string, projectKey: string, tenantId: string): Promise<UserProjectAccess> {
    const transaction = await TransactionManager.createTenantTransaction(tenantId);

    try {
      const userProjectAccess = await this._userProjectAccessRepository.getUserProjectAccess(userId, projectKey, transaction);
      await transaction.commit();
      return userProjectAccess;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  public async getAllUsersOnProject(request: GetAllUsersRequest): Promise<User[]> {
    const transaction = await TransactionManager.createTenantTransaction(request.tenantId);

    try {
      const projectKey = request.projectKey;

      if (!projectKey) {
        throw new BadRequest("Project key is required to get all users on a project");
      }

      const hasAccess = await this._userProjectAccessRepository.hasAccess(request.accessUserId, projectKey, transaction);

      if (!hasAccess) {
        throw new ForbiddenAccess("You don't have access to this project", {
          user: request.accessUserId,
          project: projectKey,
        });
      }

      const users = await this._userProjectAccessRepository.getAllUsersOnProject(projectKey, request.options, transaction);
      await transaction.commit();
      return users;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }
}
