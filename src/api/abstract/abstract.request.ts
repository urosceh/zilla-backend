import {Request} from "express";

export abstract class AbstractRequest {
  protected _adminUserId: string;

  constructor(request: Request) {
    this._adminUserId = request.query.access_id as string;

    if (!this._adminUserId) {
      throw new Error("Access ID is required");
    }
  }

  get adminUserId(): string {
    return this._adminUserId;
  }
}
