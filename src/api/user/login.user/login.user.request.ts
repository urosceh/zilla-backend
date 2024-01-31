import {Request} from "express";

export class LoginUserRequest {
  private _email: string;
  private _password: string;

  constructor(request: Request) {
    this._email = request.body.email;
    this._password = request.body.password;
  }

  get credentials(): {email: string; password: string} {
    return {email: this._email, password: this._password};
  }
}
