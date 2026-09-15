import {compareSync} from "bcrypt";
import {Transaction} from "sequelize";
import {AdminUser} from "../../domain/entities/AdminUser";
import {User} from "../../domain/entities/User";
import {BadRequest, NotFound, UnauthorizedAccess} from "../../domain/errors/errors.index";
import {IPaginatable} from "../../domain/interfaces/IPaginatable";
import AdminUserModel from "../models/admin.user.model";
import UserModel, {UserCreationAttributes, UserUpdateAttributes} from "../models/user.model";

export interface IUserRepository {
  getUserByEmail(email: string, transaction: Transaction): Promise<User>;
  createBatch(users: UserCreationAttributes[], transaction: Transaction): Promise<User[]>;
  loginUser(credentials: {email: string; password: string}, transaction: Transaction): Promise<AdminUser>;
  updateUser(userId: string, updates: UserUpdateAttributes, transaction: Transaction): Promise<User>;
  getAllUsers(options: IPaginatable, transaction: Transaction): Promise<User[]>;
  updatePassword(userId: string, data: {oldPassword: string; newPassword: string}, transaction: Transaction): Promise<User>;
  updateForgottenPassword(email: string, newPassword: string, transaction: Transaction): Promise<User>;
}

export class UserRepository implements IUserRepository {
  public async getUserByEmail(email: string, transaction: Transaction): Promise<User> {
    const user = await UserModel.findOne({
      where: {
        email,
      },
      transaction,
    });

    if (!user) {
      throw new NotFound("User Not Found", {method: this.getUserByEmail.name});
    }

    return new User(user);
  }

  public async createBatch(users: UserCreationAttributes[], transaction: Transaction): Promise<User[]> {
    try {
      const createdUsers = await UserModel.bulkCreate(users, {
        returning: true,
        ignoreDuplicates: false,
        transaction,
      });

      return createdUsers.map((user) => new User(user));
    } catch (error: any) {
      if (error.name === "SequelizeUniqueConstraintError") {
        throw new BadRequest("Email already exists", {method: this.createBatch.name});
      } else {
        throw error;
      }
    }
  }

  public async loginUser(credentials: {email: string; password: string}, transaction: Transaction): Promise<AdminUser> {
    const user = await UserModel.findOne({
      where: {
        email: credentials.email,
      },
      include: [
        {
          model: AdminUserModel,
          as: "admin",
        },
      ],
      transaction,
    });

    if (!user) {
      throw new NotFound("Email Not Found", {method: this.loginUser.name});
    }

    const isPasswordValid = compareSync(credentials.password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedAccess("Invalid Password", {method: this.loginUser.name});
    }

    return new AdminUser(user);
  }

  public async updateUser(userId: string, updates: UserUpdateAttributes, transaction: Transaction): Promise<User> {
    const updatedUsers = await UserModel.update(
      {...updates},
      {
        where: {
          userId,
        },
        returning: true,
        transaction,
      }
    );

    if (updatedUsers[1].length === 0 || !(updatedUsers[1][0] instanceof UserModel)) {
      throw new NotFound("User Not Found", {users: updatedUsers[1].map((user) => user.toJSON()), method: this.updateUser.name});
    }

    return new User(updatedUsers[1][0]);
  }

  public async getAllUsers(options: IPaginatable, transaction: Transaction): Promise<User[]> {
    const users = await UserModel.findAll({
      limit: options.limit,
      offset: options.offset,
      order: [[options.orderCol, options.orderDir]],
      transaction,
    });

    return users.map((user) => new User(user));
  }

  public async updatePassword(userId: string, data: {oldPassword: string; newPassword: string}, transaction: Transaction): Promise<User> {
    const user = await UserModel.findOne({
      where: {
        userId,
      },
      transaction,
    });

    if (!user) {
      throw new NotFound("User Not Found", {method: this.updatePassword.name, userId});
    }

    const isPasswordValid = compareSync(data.oldPassword, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedAccess("Invalid old password", {method: this.updatePassword.name});
    }

    await UserModel.update(
      {password: data.newPassword},
      {
        where: {
          userId,
        },
        transaction,
      }
    );

    return new User(user);
  }

  public async updateForgottenPassword(email: string, newPassword: string, transaction: Transaction): Promise<User> {
    const user = await UserModel.findOne({
      where: {
        email,
      },
      transaction,
    });

    if (!user) {
      throw new NotFound("User Not Found", {method: this.updateForgottenPassword.name});
    }

    await UserModel.update(
      {password: newPassword},
      {
        where: {
          email,
        },
        transaction,
      }
    );

    return new User(user);
  }
}
