import {IUserRepository} from "../../database/repositories/user.repository";
import {User} from "../entities/User";

export class UserService {
  constructor(private _userRepository: IUserRepository) {}

  public async createUsers(): Promise<User[]> {
    const users = [
      {
        email: "pera@gmail.com",
      },
      {
        email: "steva@gmail.com",
      },
    ].map((user) => new User(user));

    return this._userRepository.createBatch(users);
  }
}
