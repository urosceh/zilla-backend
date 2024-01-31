import {IAdminUserRepository} from "../../database/repositories/admin.user.repository";

export class AdminUserService {
  constructor(private _adminUserRepository: IAdminUserRepository) {}

  public async isAdmin(userId: string): Promise<boolean> {
    return this._adminUserRepository.isAdmin(userId);
  }

  public async createAdmin(userId: string): Promise<any> {
    return this._adminUserRepository.createAdmin(userId);
  }
}
