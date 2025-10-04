import {Request} from "express";
import {BadRequest} from "../../../domain/errors/errors.index";
import {AbstractRequest} from "../../abstract/abstract.request";

export class SetForgottenPasswordRequest extends AbstractRequest {
  private _securityCode: string;
  private _newPassword: string;

  constructor(request: Request) {
    super(request);
    this._securityCode = request.body.securityCode;
    this._newPassword = request.body.newPassword;

    if (!this._securityCode) {
      throw new BadRequest("Invalid request", {message: "Security code not passed"});
    }
  }

  get securityCode(): string {
    return this._securityCode;
  }

  get newPassword(): string {
    return this._newPassword;
  }
}
