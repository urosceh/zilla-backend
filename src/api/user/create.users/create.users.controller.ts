import {Request, Response} from "express";
import {UserService} from "../../../domain/services/user.service";
import {AbstractController} from "../../abstract.controller";

export class CreateUsersController extends AbstractController {
  constructor(private _userService: UserService) {
    super();
  }

  protected async process(req: Request, res: Response): Promise<Response> {
    const users = await this._userService.createUsers();

    return res.json(users);
  }
}
