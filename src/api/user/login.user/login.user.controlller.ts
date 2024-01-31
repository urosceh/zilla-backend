import {Request, Response} from "express";
import {UserService} from "../../../domain/services/user.service";
import {AbstractController} from "../../abstract/abstract.controller";
import {LoginUserRequest} from "./login.user.request";

export class LoginUserController extends AbstractController {
  constructor(private _userService: UserService) {
    super();
  }

  protected async process(req: Request, res: Response): Promise<Response> {
    const request = new LoginUserRequest(req);

    const userBearerToken = await this._userService.loginUser(request.credentials);

    return res.status(200).json(userBearerToken);
  }
}
