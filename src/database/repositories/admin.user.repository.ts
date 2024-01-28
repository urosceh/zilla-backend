import AdminUserModel from "../models/admin.user.model";
import UserModel from "../models/user.model";

export interface IAdminUserRepository {
  makeAdmin(userId: string): Promise<void>;
}

export class AdminUserRepository implements IAdminUserRepository {
  public async makeAdmin(userId: string): Promise<any> {
    const transaction = await AdminUserModel.sequelize!.transaction();

    try {
      await AdminUserModel.create(
        {
          userId,
        },
        {
          transaction,
        }
      );

      const user = await AdminUserModel.findOne({
        where: {
          userId,
        },
        include: [
          {
            model: UserModel,
            as: "user",
          },
        ],
        transaction,
      });

      await transaction.commit();
      return user;
    } catch (error) {
      // create error handling function
      await transaction.rollback();
      throw error;
    }
  }
}
