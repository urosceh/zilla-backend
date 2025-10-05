import {Request} from "express";
import {UnauthorizedAccess} from "../../domain/errors/errors.index";
import {AbstractPublicRequest} from "./abstract.request.public";

export abstract class AbstractRequest extends AbstractPublicRequest {
  private _accessUserId: string;

  constructor(request: Request) {
    super(request);
    this._accessUserId = request.headers.userId as string;

    if (!this._accessUserId) {
      throw new UnauthorizedAccess("Access ID is required", {message: "Access Id not passed to AbstractRequest"});
    }
  }

  get accessUserId(): string {
    return this._accessUserId;
  }
}
