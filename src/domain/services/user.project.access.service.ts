import {IUserProjectAccessRepository} from "../../database/repositories/user.project.access.repository";

export class UserProjectAccessService {
  constructor(private _userProjectAccessRepository: IUserProjectAccessRepository) {}

  public async insertUserProjectAccess(projectId: string, userId: string): Promise<void> {
    return this._userProjectAccessRepository.insertAccess(projectId, userId);
  }
}
