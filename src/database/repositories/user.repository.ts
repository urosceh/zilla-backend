import {compareSync} from "bcrypt";
import {User} from "../../domain/entities/User";
import UserModel, {UserCreationAttributes} from "../models/user.model";

export interface IUserRepository {
  createBatch(users: UserCreationAttributes[]): Promise<User[]>;
}

export class UserRepository implements IUserRepository {
  public async createBatch(users: UserCreationAttributes[]): Promise<User[]> {
    const createdUsers = await UserModel.bulkCreate(users, {returning: true, ignoreDuplicates: true});

    return createdUsers.map((user) => new User(user));
  }

  public async loginUser(email: string, password: string): Promise<User> {
    const user = await UserModel.findOne({
      where: {
        email,
      },
    });

    if (!user) {
      throw new Error("Invalid email");
    }

    const isPasswordValid = compareSync(password, user.password);

    if (!isPasswordValid) {
      throw new Error("Invalid password");
    }

    return new User(user);
  }
}
