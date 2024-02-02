import {IReturnable} from "../../../domain/interfaces/IReturnable";
import {UserService} from "../../../domain/services/user.service";
import {AbstractController} from "../../abstract/abstract.controller";
import {UpdateUserRequest} from "./update.user.request";
import {Request, Response} from "express";

export class UpdateUserController extends AbstractController {
  constructor(private _userService: UserService) {
    super();
  }

  protected async process(req: Request, res: Response): Promise<{statusCode: number; data: IReturnable}> {
    const request = new UpdateUserRequest(req);

    const user = await this._userService.updateUser(request.accessUserId, request.updates);

    return {
      statusCode: 200,
      data: user,
    };
  }
}
