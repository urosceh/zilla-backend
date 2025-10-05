import {Request} from "express";
import {UnauthorizedAccess} from "../../domain/errors/errors.index";

export abstract class AbstractPublicRequest {
  private _tenantId: string;
  private _tenantSchemaName: string;
  private _redisDb: number;

  constructor(request: Request) {
    this._tenantId = request.headers.tenantId as string;
    this._tenantSchemaName = request.headers.tenantSchemaName as string;
    this._redisDb = parseInt(request.headers.redisDb as string, 10);

    if (!this._tenantId) {
      throw new UnauthorizedAccess("Tenant Schema Name is required", {
        message: "Tenant Schema Name not passed to AbstractPublicRequest",
      });
    }

    if (!this._tenantSchemaName) {
      throw new UnauthorizedAccess("Tenant ID is required", {message: "Tenant ID not passed to AbstractPublicRequest"});
    }

    if (isNaN(this._redisDb)) {
      throw new UnauthorizedAccess("Redis DB is required", {message: "Redis DB not passed to AbstractPublicRequest"});
    }
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
