import {compareSync} from "bcrypt";
import {AdminUser} from "../../domain/entities/AdminUser";
import {User} from "../../domain/entities/User";
import {NotFound, UnauthorizedAccess} from "../../domain/errors/errors.index";
import {IPaginatable} from "../../domain/interfaces/IPaginatable";
import AdminUserModel from "../models/admin.user.model";
import UserModel, {UserCreationAttributes, UserUpdateAttributes} from "../models/user.model";

export interface IUserRepository {
  getUserByEmail(email: string): Promise<User>;
  createBatch(users: UserCreationAttributes[]): Promise<User[]>;
  loginUser(credentials: {email: string; password: string}): Promise<AdminUser>;
  updateUser(userId: string, updates: UserUpdateAttributes): Promise<User>;
  getAllUsers(options: IPaginatable): Promise<User[]>;
  updatePassword(userId: string, data: {oldPassword: string; newPassword: string}): Promise<User>;
  updateForgottenPassword(email: string, newPassword: string): Promise<User>;
}

export class UserRepository implements IUserRepository {
  public async getUserByEmail(email: string): Promise<User> {
    const user = await UserModel.findOne({
      where: {
        email,
      },
    });

    if (!user) {
      throw new NotFound("User Not Found", {method: this.getUserByEmail.name});
    }

    return new User(user);
  }

  public async createBatch(users: UserCreationAttributes[]): Promise<User[]> {
    const createdUsers = await UserModel.bulkCreate(users, {returning: true, ignoreDuplicates: true});

    return createdUsers.map((user) => new User(user));
  }

  public async loginUser(credentials: {email: string; password: string}): Promise<AdminUser> {
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

  public async updateUser(userId: string, updates: UserUpdateAttributes): Promise<User> {
    const updatedUsers = await UserModel.update(
      {...updates},
      {
        where: {
          userId,
        },
        returning: true,
      }
    );

    if (updatedUsers[1].length === 0 || !(updatedUsers[1][0] instanceof UserModel)) {
      throw new NotFound("User Not Found", {users: updatedUsers[1].map((user) => user.toJSON()), method: this.updateUser.name});
    }

    return new User(updatedUsers[1][0]);
  }

  public async getAllUsers(options: IPaginatable): Promise<User[]> {
    const users = await UserModel.findAll({
      limit: options.limit,
      offset: options.offset,
      order: [[options.orderCol, options.orderDir]],
    });

    return users.map((user) => new User(user));
  }

  public async updatePassword(userId: string, data: {oldPassword: string; newPassword: string}): Promise<User> {
    const user = await UserModel.findOne({
      where: {
        userId,
      },
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
      }
    );

    return new User(user);
  }

  public async updateForgottenPassword(email: string, newPassword: string): Promise<User> {
    const user = await UserModel.findOne({
      where: {
        email,
      },
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
      }
    );

    return new User(user);
  }
}
