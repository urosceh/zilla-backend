import {Request} from "express";
import {IPaginatable} from "../../../domain/interfaces/IPaginatable";
import {AbstractRequest} from "../../abstract/abstract.request";

export class GetAllUsersRequest extends AbstractRequest {
  private _projectKey: string | undefined;
  private _limit: number;
  private _offset: number;

  constructor(req: Request) {
    super(req);
    this._projectKey = req.query.projectKey as string;
    this._limit = req.query.limit as unknown as number;
    this._offset = req.query.offset as unknown as number;
  }

  public get projectKey() {
    return this._projectKey;
  }

  public get options(): IPaginatable {
    return {
      limit: this._limit,
      offset: this._offset,
      orderCol: "email",
      orderDir: "ASC",
    };
  }
}
