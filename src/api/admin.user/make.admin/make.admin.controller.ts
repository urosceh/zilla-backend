import {Request, Response} from "express";
import {AdminUserService} from "../../../domain/services/admin.user.service";
import {AbstractController} from "../../abstract.controller";
import {MakeAdminRequest} from "./make.admin.request";

export class MakeAdminController extends AbstractController {
  constructor(private _adminUserService: AdminUserService) {
    super();
  }

  protected async process(req: Request, res: Response): Promise<Response> {
    const request = new MakeAdminRequest(req);

    const user = await this._adminUserService.makeAdmin(request.userId);

    return res.status(200).json(user);
  }
}
