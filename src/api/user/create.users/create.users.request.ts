import {Request} from "express";

export class CreateUsersRequest {
  private emails: string[];

  constructor(requset: Request) {
    this.emails = requset.body.emails;
  }
}
