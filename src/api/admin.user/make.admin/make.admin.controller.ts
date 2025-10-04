import {Request} from "express";
import {User} from "../../../domain/entities/User";
import {IDtoable} from "../../../domain/interfaces/IReturnable";
import {AdminUserService} from "../../../domain/services/admin.user.service";
import {AbstractController} from "../../abstract/abstract.controller";
import {MakeAdminRequest} from "./make.admin.request";

export class MakeAdminController extends AbstractController {
  constructor(private _adminUserService: AdminUserService) {
    super();
  }

  protected async process(req: Request): Promise<{statusCode: number; data: IDtoable}> {
    const request = new MakeAdminRequest(req);

    const user: User = await this._adminUserService.createAdmin(request);

    return {
      statusCode: 201,
      data: user,
    };
  }
}
