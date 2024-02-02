import {Request} from "express";
import {AbstractRequest} from "../../abstract/abstract.request";

export class UpdateUserRequest extends AbstractRequest {
  private _firstName: string | undefined;
  private _lastName: string | undefined;

  constructor(request: Request) {
    super(request);
    this._firstName = request.body.firstName;
    this._lastName = request.body.lastName;
  }

  get updates(): {firstName?: string; lastName?: string} {
    return {
      firstName: this._firstName,
      lastName: this._lastName,
    };
  }
}
