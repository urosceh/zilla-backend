import {Request} from "express";
import {AbstractRequest} from "../../abstract/abstract.request";

export class ForgottenPasswordRequest extends AbstractRequest {
  private _email: string;

  constructor(request: Request) {
    super(request);
    this._email = request.body.email;
  }

  get email(): string {
    return this._email;
  }
}
