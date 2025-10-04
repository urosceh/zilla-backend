import {Request} from "express";
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
      const users = await this._userProjectAccessService.getAllUsersOnProject(request);

      return {
        statusCode: 200,
        data: users,
      };
    } else {
      const users = await this._userService.getAllUsers(request);

      return {
        statusCode: 200,
        data: users,
      };
    }
  }
}
