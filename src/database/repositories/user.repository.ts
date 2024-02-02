import {compareSync} from "bcrypt";
import {User} from "../../domain/entities/User";
import UserModel, {UserCreationAttributes, UserUpdateAttributes} from "../models/user.model";

export interface IUserRepository {
  getUserByEmail(email: string): Promise<User>;
  createBatch(users: UserCreationAttributes[]): Promise<User[]>;
  loginUser(credentials: {email: string; password: string}): Promise<User>;
  updateUser(userId: string, updates: UserUpdateAttributes): Promise<User>;
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
      throw new Error("Invalid email");
    }

    return new User(user);
  }

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

    if (updatedUsers[1].length === 0) {
      throw new Error("No user found");
    }

    return new User(updatedUsers[1][0]);
  }

  public async updatePassword(userId: string, data: {oldPassword: string; newPassword: string}): Promise<User> {
    const user = await UserModel.findOne({
      where: {
        userId,
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
      throw new Error("Invalid user id");
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
