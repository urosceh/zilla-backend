import {IAdminUserRepository} from "../../database/repositories/admin.user.repository";

export class AdminUserService {
  constructor(private _adminUserRepository: IAdminUserRepository) {}

  public async makeAdmin(userId: string): Promise<any> {
    return await this._adminUserRepository.makeAdmin(userId);
  }
}
