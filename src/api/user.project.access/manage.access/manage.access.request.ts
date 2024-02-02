import {AbstractRequest} from "../../abstract/abstract.request";

export class ManageAccessRequest extends AbstractRequest {
  private _userIds: string[];
  private _projectKey: string;

  constructor(request: any) {
    super(request);
    this._userIds = request.body.userIds;
    this._projectKey = request.body.projectKey;
  }

  get userIds(): string[] {
    return this._userIds;
  }

  get projectKey(): string {
    return this._projectKey;
  }
}
