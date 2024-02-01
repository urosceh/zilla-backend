import {IAdminUserRepository} from "../../database/repositories/admin.user.repository";
import {User} from "../entities/User";

export class AdminUserService {
  constructor(private _adminUserRepository: IAdminUserRepository) {}

  public async isAdmin(userId: string): Promise<boolean> {
    return this._adminUserRepository.isAdmin(userId);
  }

  public async createAdmin(userId: string): Promise<User> {
    return this._adminUserRepository.createAdmin(userId);
  }
}
