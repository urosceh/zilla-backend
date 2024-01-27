import {Request} from "express";

export class CreateUsersRequest {
  private _emails: string[];

  constructor(requset: Request) {
    this._emails = requset.body.emails;
  }

  public get emails(): string[] {
    return this._emails;
  }
}
