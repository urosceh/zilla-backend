import {User} from "../../domain/entities/User";
import AdminUserModel from "../models/admin.user.model";
import UserModel from "../models/user.model";

export interface IAdminUserRepository {
  isAdmin(userId: string): Promise<boolean>;
  createAdmin(userId: string): Promise<User>;
}

export class AdminUserRepository implements IAdminUserRepository {
  public async isAdmin(userId: string): Promise<boolean> {
    const adminUser = await AdminUserModel.findOne({
      where: {
        userId,
      },
    });

    return !!adminUser;
  }

  public async createAdmin(userId: string): Promise<User> {
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

      if (!user) {
        throw new Error("User not found");
      }

      await transaction.commit();
      return new User(user.user!);
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }
}
