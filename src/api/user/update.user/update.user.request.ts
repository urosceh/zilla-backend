import {Request} from "express";
import {AbstractRequest} from "../../abstract/abstract.request";

export class UpdateUserRequest extends AbstractRequest {
  private _password: string | undefined;
  private _oldPassword: string | undefined;
  private _firstName: string | undefined;
  private _lastName: string | undefined;

  constructor(request: Request) {
    super(request);
    this._password = request.body.password;
    this._oldPassword = request.body.oldPassword;
    this._firstName = request.body.firstName;
    this._lastName = request.body.lastName;
  }

  get updates(): {password?: string; oldPassword?: string; firstName?: string; lastName?: string} {
    return {
      password: this._password,
      oldPassword: this._oldPassword,
      firstName: this._firstName,
      lastName: this._lastName,
    };
  }
}
