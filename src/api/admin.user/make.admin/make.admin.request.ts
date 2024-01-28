import {Request} from "express";

export class MakeAdminRequest {
  private _userId: string;

  constructor(request: Request) {
    this._userId = request.params.userId;
  }

  get userId(): string {
    return this._userId;
  }
}
