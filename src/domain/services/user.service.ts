import {IUserRepository} from "../../database/repositories/user.repository";
import {User} from "../entities/User";

export class UserService {
  constructor(private _userRepository: IUserRepository) {}

  public async createUsers(emails: string[]): Promise<User[]> {
    const users: User[] = emails.map((email) => new User({email, password: "123456"}));

    return this._userRepository.createBatch(users);
  }
}
