import {UserCreationAttributes} from "../../database/models/user.model";
import {IUserRepository} from "../../database/repositories/user.repository";
import {User} from "../entities/User";

export class UserService {
  constructor(private _userRepository: IUserRepository) {}

  public async createUsers(emails: string[]): Promise<User[]> {
    const users: UserCreationAttributes[] = emails.map((email) => ({email, password: "123456"}));

    return this._userRepository.createBatch(users);
  }
}
