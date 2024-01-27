import {Request, Response} from "express";
import {UserService} from "../../../domain/services/user.service";
import {AbstractController} from "../../abstract.controller";
import {CreateUsersRequest} from "./create.users.request";

export class CreateUsersController extends AbstractController {
  constructor(private _userService: UserService) {
    super();
  }

  protected async process(req: Request, res: Response): Promise<Response> {
    const createUsersRequest = new CreateUsersRequest(req);

    const users = await this._userService.createUsers(createUsersRequest.emails);

    return res.json(users);
  }
}
