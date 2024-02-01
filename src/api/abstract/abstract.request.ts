import {Request} from "express";

export abstract class AbstractRequest {
  private _accessUserId: string;

  constructor(request: Request) {
    this._accessUserId = request.headers.userId as string;

    if (!this._accessUserId) {
      throw new Error("Access ID is required");
    }
  }

  get accessUserId(): string {
    return this._accessUserId;
  }
}
