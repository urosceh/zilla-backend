import {Transaction} from "sequelize";
import {User} from "../../domain/entities/User";
import {NotFound} from "../../domain/errors/errors.index";
import AdminUserModel from "../models/admin.user.model";
import UserModel from "../models/user.model";

export interface IAdminUserRepository {
  isAdmin(userId: string, transaction: Transaction): Promise<boolean>;
  createAdmin(userId: string, transaction: Transaction): Promise<User>;
}

export class AdminUserRepository implements IAdminUserRepository {
  public async isAdmin(userId: string, transaction: Transaction): Promise<boolean> {
    const adminUser = await AdminUserModel.findOne({
      where: {
        userId,
      },
      transaction,
    });

    return !!adminUser;
  }

  public async createAdmin(userId: string, transaction: Transaction): Promise<User> {
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
      throw new NotFound("User Not Found", {method: this.createAdmin.name, userId});
    }

    return new User(user.user!);
  }
}
