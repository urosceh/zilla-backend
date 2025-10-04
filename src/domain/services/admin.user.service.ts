import {MakeAdminRequest} from "../../api/admin.user/make.admin/make.admin.request";
import {IAdminUserRepository} from "../../database/repositories/admin.user.repository";
import {TransactionManager} from "../../database/transaction.manager";
import {User} from "../entities/User";

interface AdminValidationRequest {
  userId: string;
  tenantSchemaName: string;
}

export class AdminUserService {
  constructor(private _adminUserRepository: IAdminUserRepository) {}

  public async isAdmin(userId: string, tenantSchemaName: string): Promise<boolean> {
    const transaction = await TransactionManager.createTenantTransaction(tenantSchemaName);

    try {
      const result = await this._adminUserRepository.isAdmin(userId, transaction);
      await transaction.commit();
      return result;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  public async createAdmin(request: MakeAdminRequest): Promise<User> {
    const transaction = await TransactionManager.createTenantTransaction(request.tenantSchemaName);

    try {
      const user = await this._adminUserRepository.createAdmin(request.userId, transaction);
      await transaction.commit();
      return user;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }
}
