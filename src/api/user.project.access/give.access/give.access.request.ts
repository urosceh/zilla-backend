import {AbstractRequest} from "../../abstract/abstract.request";

export class GiveAccessRequest extends AbstractRequest {
  private _userId: string;
  private _projectId: string;

  constructor(request: any) {
    super(request);
    this._userId = request.body.userId;
    this._projectId = request.body.projectId;
  }

  get userId(): string {
    return this._userId;
  }

  get projectId(): string {
    return this._projectId;
  }
}
