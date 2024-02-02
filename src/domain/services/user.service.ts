import {UserCreationAttributes} from "../../database/models/user.model";
import {IUserRepository} from "../../database/repositories/user.repository";
import {IMailClient} from "../../external/mail.client/mail.client";
import {JwtGenerator} from "../../lib/jwt/jwt.generator";
import {User} from "../entities/User";

export class UserService {
  constructor(private _userRepository: IUserRepository, private _mailClient: IMailClient) {}

  public async loginUser(credentials: {email: string; password: string}): Promise<string> {
    const user = await this._userRepository.loginUser(credentials);

    return JwtGenerator.generateUserBearerToken(user.userId);
  }

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
}
