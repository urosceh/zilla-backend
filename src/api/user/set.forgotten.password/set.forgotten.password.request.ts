import {Request} from "express";
import {AbstractRequest} from "../../abstract/abstract.request";

export class SetForgottenPasswordRequest {
  private _securityCode: string;
  private _newPassword: string;

  constructor(request: Request) {
    this._securityCode = request.body.securityCode;
    this._newPassword = request.body.newPassword;

    if (!this._securityCode) {
      throw new Error("Invalid request");
    }
  }

  get securityCode(): string {
    return this._securityCode;
  }

  get newPassword(): string {
    return this._newPassword;
  }
}
