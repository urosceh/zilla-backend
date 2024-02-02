import {compareSync} from "bcrypt";
import {Transaction} from "sequelize";
import {User} from "../../domain/entities/User";
import UserModel, {UserCreationAttributes, UserUpdateAttributes} from "../models/user.model";

export interface IUserRepository {
  createBatch(users: UserCreationAttributes[]): Promise<User[]>;
  loginUser(credentials: {email: string; password: string}): Promise<User>;
  updateUser(userId: string, updates: UserUpdateAttributes, options?: {transaction: Transaction}): Promise<User>;
  updatePassword(data: {userId: string; oldPassword: string; newPassword: string}, options: {transaction: Transaction}): Promise<User>;
}

export class UserRepository implements IUserRepository {
  public async createBatch(users: UserCreationAttributes[]): Promise<User[]> {
    const createdUsers = await UserModel.bulkCreate(users, {returning: true, ignoreDuplicates: true});

    return createdUsers.map((user) => new User(user));
  }

  public async loginUser(credentials: {email: string; password: string}): Promise<User> {
    const user = await UserModel.findOne({
      where: {
        email: credentials.email,
      },
    });

    if (!user) {
      throw new Error("Invalid email");
    }

    const isPasswordValid = compareSync(credentials.password, user.password);

    if (!isPasswordValid) {
      throw new Error("Invalid password");
    }

    return new User(user);
  }

  public async updateUser(userId: string, updates: UserUpdateAttributes, options: {transaction: Transaction}): Promise<User> {
    const updatedUsers = await UserModel.update(
      {...updates},
      {
        where: {
          userId,
        },
        transaction: options.transaction,
        returning: true,
      }
    );

    if (updatedUsers[1].length === 0) {
      throw new Error("No user found");
    }

    return new User(updatedUsers[1][0]);
  }

  public async updatePassword(
    data: {userId: string; oldPassword: string; newPassword: string},
    options: {transaction: Transaction}
  ): Promise<User> {
    const user = await UserModel.findOne({
      where: {
        userId: data.userId,
      },
    });

    if (!user) {
      throw new Error("Invalid user id");
    }

    const isPasswordValid = compareSync(data.oldPassword, user.password);

    if (!isPasswordValid) {
      throw new Error("Invalid old password");
    }

    await UserModel.update(
      {password: data.newPassword},
      {
        where: {
          userId: data.userId,
        },
        transaction: options.transaction,
      }
    );

    return new User(user);
  }
}
