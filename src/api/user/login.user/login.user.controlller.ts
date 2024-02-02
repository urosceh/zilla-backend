import {Request, Response} from "express";
import {IBearerData} from "../../../domain/interfaces/IReturnable";
import {UserService} from "../../../domain/services/user.service";
import {AbstractController} from "../../abstract/abstract.controller";
import {LoginUserRequest} from "./login.user.request";

export class LoginUserController extends AbstractController {
  constructor(private _userService: UserService) {
    super();
  }

  protected async process(req: Request, res: Response): Promise<{statusCode: number; data: IBearerData}> {
    const request = new LoginUserRequest(req);

    const bearerToken = await this._userService.loginUser(request.credentials);

    return {
      statusCode: 200,
      data: {bearerToken},
    };
  }
}
