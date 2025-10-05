import {Request} from "express";
import {AbstractPublicRequest} from "../../abstract/abstract.request.public";

export class LoginUserRequest extends AbstractPublicRequest {
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
