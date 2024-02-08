import UserModel from "../../database/models/user.model";
import {User} from "./User";

export class AdminUser extends User {
  private _isAdmin: boolean;

  constructor(user: UserModel) {
    super(user);
    this._isAdmin = !!user.admin;
  }

  public get isAdmin(): boolean {
    return this._isAdmin;
  }
}
