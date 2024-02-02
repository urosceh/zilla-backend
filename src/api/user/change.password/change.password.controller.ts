import {Request, Response} from "express";
import {IBearerData} from "../../../domain/interfaces/IReturnable";
import {UserService} from "../../../domain/services/user.service";
import {AbstractController} from "../../abstract/abstract.controller";
import {ChangePasswordRequest} from "./change.password.request";

export class ChangePasswordController extends AbstractController {
  constructor(private _userService: UserService) {
    super();
  }

  protected async process(req: Request, res: Response): Promise<{statusCode: number; data: IBearerData}> {
    const request = new ChangePasswordRequest(req);

    const bearerToken: string = await this._userService.updatePassword(request.accessUserId, request.passwordData);

    return {
      statusCode: 200,
      data: {
        bearerToken,
      },
    };
  }
}
