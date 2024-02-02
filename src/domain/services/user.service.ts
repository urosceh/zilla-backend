import {UserCreationAttributes, UserUpdateAttributes} from "../../database/models/user.model";
import {IUserRepository} from "../../database/repositories/user.repository";
import sequelize from "../../database/sequelize";
import {IMailClient} from "../../external/mail.client/mail.client";
import {JwtGenerator} from "../../lib/jwt/jwt.generator";
import {User} from "../entities/User";

export class UserService {
  constructor(private _userRepository: IUserRepository, private _mailClient: IMailClient) {}

  public async createUsers(emails: string[]): Promise<User[]> {
    const userCredentials: UserCreationAttributes[] = emails.map((email) => {
      return {
        email,
        password: Math.random().toString(36).slice(-10),
      };
    });

    const createdUsers = await this._userRepository.createBatch(userCredentials);

    // userCredentials.forEach((credential) => {
    //   this._mailClient.sendMail(credential.email, credential.password);
    // });
    console.log(JSON.stringify(userCredentials));

    return createdUsers;
  }

  public async loginUser(credentials: {email: string; password: string}): Promise<string> {
    const user = await this._userRepository.loginUser(credentials);

    return JwtGenerator.generateUserBearerToken(user.userId);
  }

  public async updateUser(
    userId: string,
    updates: {newPassword?: string; oldPassword?: string; firstName?: string; lastName?: string}
  ): Promise<User> {
    const transaction = await sequelize.transaction();

    const {newPassword, oldPassword, firstName, lastName} = updates;

    let user: User | null = null;

    if (!!newPassword && !!oldPassword) {
      user = await this._userRepository.updatePassword({userId, newPassword, oldPassword}, {transaction});
    }

    if (!!firstName || !!lastName) {
      user = await this._userRepository.updateUser(userId, {firstName, lastName}, {transaction});
    }

    if (!user) {
      throw new Error("Arguments have to be passed");
    }

    return user;
  }
}
