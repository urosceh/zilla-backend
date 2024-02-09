import {Request} from "express";
import {IUser} from "../../../domain/interfaces/IUser";
import {AbstractRequest} from "../../abstract/abstract.request";

export class CreateUsersRequest extends AbstractRequest {
  private _users: IUser[];

  constructor(request: Request) {
    super(request);
    this._users = request.body.users;
  }

  public get users(): IUser[] {
    return this._users;
  }
}
