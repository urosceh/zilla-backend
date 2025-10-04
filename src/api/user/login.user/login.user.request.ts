import {Request} from "express";
import {AbstractRequest} from "../../abstract/abstract.request";

export class LoginUserRequest extends AbstractRequest {
  private _email: string;
  private _password: string;

  constructor(request: Request) {
    super(request);
    this._email = request.body.email;
    this._password = request.body.password;
  }

  get credentials(): {email: string; password: string} {
    return {email: this._email, password: this._password};
  }
}
