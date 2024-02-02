import {Request} from "express";
import {UnauthorizedAccess} from "../../domain/errors/errors.index";

export abstract class AbstractRequest {
  private _accessUserId: string;

  constructor(request: Request) {
    this._accessUserId = request.headers.userId as string;

    if (!this._accessUserId) {
      throw new UnauthorizedAccess("Access ID is required", {message: "Access Id not passed to AbstractRequest"});
    }
  }

  get accessUserId(): string {
    return this._accessUserId;
  }
}
