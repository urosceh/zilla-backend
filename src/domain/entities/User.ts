import UserModel from "../../database/models/user.model";
import {IReturnable} from "../interfaces/IReturnable";

export class User implements IReturnable {
  private _userId: string;
  private _email: string;
  private _password: string;
  private _firstName: string | null;
  private _lastName: string | null;
  private _createdAt: Date;
  private _updatedAt: Date;
  private _deletedAt: Date | null;

  constructor(user: UserModel) {
    this._userId = user.userId;
    this._email = user.email;
    this._password = user.password;
    this._firstName = user.firstName;
    this._lastName = user.lastName;
    this._createdAt = user.createdAt;
    this._updatedAt = user.updatedAt;
    this._deletedAt = user.deletedAt;
  }

  public createDto() {
    return {
      userId: this._userId,
      email: this._email,
      firstName: this._firstName,
      lastName: this._lastName,
    };
  }

  get userId(): string {
    return this._userId;
  }

  get email(): string {
    return this._email;
  }
}
