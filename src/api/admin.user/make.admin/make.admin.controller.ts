import {Request, Response} from "express";
import {AdminUserService} from "../../../domain/services/admin.user.service";
import {AdminAbstractController} from "../../abstract/admin.abstract.controller";
import {MakeAdminRequest} from "./make.admin.request";

export class MakeAdminController extends AdminAbstractController {
  constructor(adminUserService: AdminUserService) {
    super(adminUserService);
  }

  protected async process(req: Request, res: Response): Promise<Response> {
    const request = new MakeAdminRequest(req);

    const isAdmin = await this.isAdminUser(request.accessUserId);

    if (!isAdmin) {
      return res.status(403).json({
        message: "You are not authorized to make user an admin",
      });
    }

    const user = await this._adminUserService.createAdmin(request.userId);

    return res.status(200).json(user);
  }
}
