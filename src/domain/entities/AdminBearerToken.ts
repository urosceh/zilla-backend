import {IDtoable} from "../interfaces/IReturnable";

export class AdminBearerToken implements IDtoable {
  constructor(private _bearerToken: string, private _adminBearerToken?: string) {}

  public toDto(): {bearerToken: string; adminBearerToken?: string} {
    const bearer = {
      bearerToken: this._bearerToken,
    };

    if (this._adminBearerToken) {
      Object.assign(bearer, {adminBearerToken: this._adminBearerToken});
    }

    return bearer;
  }
}
