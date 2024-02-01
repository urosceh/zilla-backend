import {Request, Response} from "express";
import {User} from "../../../domain/entities/User";
import {IReturnable} from "../../../domain/interfaces/IReturnable";
import {AdminUserService} from "../../../domain/services/admin.user.service";
import {AbstractController} from "../../abstract/abstract.controller";
import {MakeAdminRequest} from "./make.admin.request";

export class MakeAdminController extends AbstractController {
  constructor(private _adminUserService: AdminUserService) {
    super();
  }

  protected async process(req: Request, res: Response): Promise<{statusCode: number; data: IReturnable}> {
    const request = new MakeAdminRequest(req);

    const user: User = await this._adminUserService.createAdmin(request.userId);

    return {
      statusCode: 201,
      data: user,
    };
  }
}
