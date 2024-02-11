import {Request} from "express";
import {AdminBearerToken} from "../../../domain/entities/AdminBearerToken";
import {IDtoable} from "../../../domain/interfaces/IReturnable";
import {UserService} from "../../../domain/services/user.service";
import {AbstractController} from "../../abstract/abstract.controller";
import {LoginUserRequest} from "./login.user.request";

export class LoginUserController extends AbstractController {
  constructor(private _userService: UserService) {
    super();
  }

  protected async process(req: Request): Promise<{statusCode: number; data: IDtoable}> {
    const request = new LoginUserRequest(req);

    const roleBearerToken: AdminBearerToken = await this._userService.loginUser(request.credentials);

    return {
      statusCode: 200,
      data: roleBearerToken,
    };
  }
}
