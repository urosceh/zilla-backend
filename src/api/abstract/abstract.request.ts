import {Request} from "express";
import {UnauthorizedAccess} from "../../domain/errors/errors.index";

export abstract class AbstractRequest {
  private _accessUserId: string;
  private _tenantId: string;
  private _tenantSchemaName: string;
  private _redisDb: number;

  constructor(request: Request) {
    this._accessUserId = request.headers.userId as string;
    this._tenantId = request.headers.tenantId as string;
    this._tenantSchemaName = request.headers.tenantSchemaName as string;
    this._redisDb = parseInt(request.headers.redisDb as string, 10);

    if (!this._accessUserId) {
      throw new UnauthorizedAccess("Access ID is required", {message: "Access Id not passed to AbstractRequest"});
    }

    if (!this._tenantId) {
      throw new UnauthorizedAccess("Tenant Schema Name is required", {
        message: "Tenant Schema Name not passed to AbstractRequest",
      });
    }

    if (!this._tenantSchemaName) {
      throw new UnauthorizedAccess("Tenant ID is required", {message: "Tenant ID not passed to AbstractRequest"});
    }

    if (isNaN(this._redisDb)) {
      throw new UnauthorizedAccess("Redis DB is required", {message: "Redis DB not passed to AbstractRequest"});
    }
  }

  get accessUserId(): string {
    return this._accessUserId;
  }

  get tenantId(): string {
    return this._tenantId;
  }

  get tenantSchemaName(): string {
    return this._tenantSchemaName;
  }

  get redisDb(): number {
    return this._redisDb;
  }
}
