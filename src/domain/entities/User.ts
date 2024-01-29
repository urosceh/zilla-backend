import UserModel, {UserCreationAttributes} from "../../database/models/user.model";
import {IUser} from "../interfaces/IUser";

export class User {
  private _userId: string | null;
  private _email: string;
  private _password: string | null;
  private _firstName: string | null;
  private _lastName: string | null;
  private _createdAt: Date;
  private _updatedAt: Date;
  private _deletedAt: Date | null;

  constructor(user: UserModel) {
    this._userId = user.userId || null;
    this._email = user.email;
    this._password = user.password || null;
    this._firstName = user.firstName || null;
    this._lastName = user.lastName || null;
    this._createdAt = user.createdAt;
    this._updatedAt = user.updatedAt;
    this._deletedAt = user.deletedAt;
  }
}
