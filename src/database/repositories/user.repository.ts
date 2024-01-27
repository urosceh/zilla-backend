import {User} from "../../domain/entities/User";
import UserModel from "../models/user.model";

export interface IUserRepository {
  createBatch(users: User[]): Promise<User[]>;
}

export class UserRepository implements IUserRepository {
  public async createBatch(users: User[]): Promise<User[]> {
    const createdUsers = await UserModel.bulkCreate(
      users.map((user) => user.getForBatchCreate()),
      {returning: true, ignoreDuplicates: true}
    );

    return createdUsers.map((user) => new User(user.toJSON()));
  }
}
