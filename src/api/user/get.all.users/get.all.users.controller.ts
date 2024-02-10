import {Request} from "express";
import {ForbiddenAccess} from "../../../domain/errors/errors.index";
import {IDtoable} from "../../../domain/interfaces/IReturnable";
import {AdminUserService} from "../../../domain/services/admin.user.service";
import {UserProjectAccessService} from "../../../domain/services/user.project.access.service";
import {UserService} from "../../../domain/services/user.service";
import {AbstractController} from "../../abstract/abstract.controller";
import {GetAllUsersRequest} from "./get.all.users.request";

export class GetAllUsersController extends AbstractController {
  constructor(
    private _userService: UserService,
    private _userProjectAccessService: UserProjectAccessService,
    private _adminUserService: AdminUserService
  ) {
    super();
  }

  protected async process(req: Request): Promise<{statusCode: number; data: IDtoable[]}> {
    const request = new GetAllUsersRequest(req);

    if (request.projectKey) {
      const hasAccess = this._userProjectAccessService.hasAccessToProject(request.accessUserId, request.projectKey);

      if (!hasAccess) {
        throw new ForbiddenAccess("You don't have access to this project", {
          user: request.accessUserId,
          project: request.projectKey,
          message: "/user/all",
        });
      }

      const users = await this._userProjectAccessService.getAllUsersOnProject(request.projectKey, request.options);

      return {
        statusCode: 200,
        data: users,
      };
    } else {
      const isAdmin = await this._adminUserService.isAdmin(request.accessUserId);

      if (!isAdmin) {
        throw new ForbiddenAccess("You don't have access to this resource", {
          user: request.accessUserId,
          message: "/user/all as admin",
        });
      }

      const users = await this._userService.getAllUsers(request.options);

      return {
        statusCode: 200,
        data: users,
      };
    }
  }
}
