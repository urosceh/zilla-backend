import {Request, Response} from "express";
import {AdminUserService} from "../../../domain/services/admin.user.service";
import {UserService} from "../../../domain/services/user.service";
import {AdminAbstractController} from "../../abstract/admin.abstract.controller";
import {CreateUsersRequest} from "./create.users.request";

export class CreateUsersController extends AdminAbstractController {
  constructor(private _userService: UserService, adminUserService: AdminUserService) {
    super(adminUserService);
  }

  protected async process(req: Request, res: Response): Promise<Response> {
    const request = new CreateUsersRequest(req);

    const isAdmin = await this.isAdminUser(request.accessUserId);

    if (!isAdmin) {
      return res.status(403).json({
        message: "You are not authorized to create users",
      });
    }

    const users = await this._userService.createUsers(request.emails);

    return res.json(users);
  }
}
