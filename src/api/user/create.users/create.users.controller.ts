import {Request} from "express";
import {User} from "../../../domain/entities/User";
import {IDtoable} from "../../../domain/interfaces/IReturnable";
import {UserService} from "../../../domain/services/user.service";
import {AbstractController} from "../../abstract/abstract.controller";
import {CreateUsersRequest} from "./create.users.request";

export class CreateUsersController extends AbstractController {
  constructor(private _userService: UserService) {
    super();
  }

  protected async process(req: Request): Promise<{statusCode: number; data: IDtoable[]}> {
    const request = new CreateUsersRequest(req);

    const users: User[] = await this._userService.createUsers(request);

    return {
      statusCode: 201,
      data: users,
    };
  }
}
