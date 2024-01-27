import {Injectable} from "@nestjs/common";
import {User} from "../../domain/entities/User";
import UserModel from "../models/UserModel";

export interface IUserRepository {
  createBatch(users: User[]): Promise<User[]>;
}

@Injectable()
export class UserRepository implements IUserRepository {
  public async createBatch(users: User[]): Promise<User[]> {
    const createdUsers = await UserModel.bulkCreate(users, {returning: true});

    return createdUsers.map((user) => new User(user.toJSON()));
  }
}
