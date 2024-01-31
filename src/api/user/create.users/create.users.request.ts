import {Request} from "express";
import {AbstractRequest} from "../../abstract/abstract.request";

export class CreateUsersRequest extends AbstractRequest {
  private _emails: string[];

  constructor(requset: Request) {
    super(requset);
    this._emails = requset.body.emails;
  }

  public get emails(): string[] {
    return this._emails;
  }
}
