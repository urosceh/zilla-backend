import {Request} from "express";
import {BadRequest} from "../../../domain/errors/errors.index";
import {AbstractRequest} from "../../abstract/abstract.request";

export class ChangePasswordRequest extends AbstractRequest {
  private _newPassword: string;
  private _oldPassword: string;

  constructor(request: Request) {
    super(request);
    this._newPassword = request.body.newPassword;
    this._oldPassword = request.body.oldPassword;

    if (!this._newPassword || !this._oldPassword) {
      throw new BadRequest("Invalid request", {message: "New and old password are required"});
    }
  }

  get passwordData(): {newPassword: string; oldPassword: string} {
    return {
      newPassword: this._newPassword,
      oldPassword: this._oldPassword,
    };
  }
}
