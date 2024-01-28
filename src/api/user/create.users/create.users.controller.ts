import {Request, Response} from "express";
import {UserService} from "../../../domain/services/user.service";
import {AbstractController} from "../../abstract.controller";
import {CreateUsersRequest} from "./create.users.request";

export class CreateUsersController extends AbstractController {
  constructor(private _userService: UserService) {
    super();
  }

  protected async process(req: Request, res: Response): Promise<Response> {
    const request = new CreateUsersRequest(req);

    const users = await this._userService.createUsers(request.emails);

    return res.json(users);
  }
}
