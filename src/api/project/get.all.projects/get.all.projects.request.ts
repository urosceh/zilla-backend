import {Request} from "express";
import {AbstractRequest} from "../../abstract/abstract.request";

export class GetAllProjectsRequest extends AbstractRequest {
  private _limit: number;
  private _offset: number;
  private _search: string | undefined;

  constructor(request: Request) {
    super(request);
    this._limit = parseInt(request.query.limit as string, 10) as number;
    this._offset = parseInt(request.query.offset as string, 10) as number;
    this._search = request.query.search as string;
  }

  public get options() {
    return {
      limit: this._limit,
      offset: this._offset,
      search: this._search,
    };
  }
}
