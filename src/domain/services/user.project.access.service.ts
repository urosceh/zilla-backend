import {IUserProjectAccessRepository} from "../../database/repositories/user.project.access.repository";

export class UserProjectAccessService {
  constructor(private _userProjectAccessRepository: IUserProjectAccessRepository) {}

  public async giveProjectAccessToUsers(userIds: string[], projectKey: string): Promise<void> {
    return this._userProjectAccessRepository.insertAccess(userIds, projectKey);
  }
}
