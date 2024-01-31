import {Request} from "express";
import {AbstractRequest} from "../../abstract/abstract.request";

export class MakeAdminRequest extends AbstractRequest {
  private _userId: string;

  constructor(request: Request) {
    super(request);
    this._userId = request.params.userId;
  }

  get userId(): string {
    return this._userId;
  }
}
