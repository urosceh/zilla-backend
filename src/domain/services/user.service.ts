import {UserCreationAttributes} from "../../database/models/user.model";
import {IUserRepository} from "../../database/repositories/user.repository";
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

  public async updateUser(userId: string, updates: {firstName?: string; lastName?: string}): Promise<User> {
    const {firstName, lastName} = updates;

    const user = await this._userRepository.updateUser(userId, {firstName, lastName});

    return user;
  }

  public async updatePassword(userId: string, passwordData: {oldPassword: string; newPassword: string}): Promise<string> {
    const {oldPassword, newPassword} = passwordData;

    if (oldPassword === newPassword) {
      throw new Error("Old and new passwords cannot be the same");
    }
    if (!oldPassword || !newPassword) {
      throw new Error("Old and new passwords are required");
    }

    const user = await this._userRepository.updatePassword(userId, {oldPassword, newPassword});

    return JwtGenerator.generateUserBearerToken(user.userId);
  }

  public async updateForgottenPassword(email: string, newPassword: string): Promise<string> {
    const user = await this._userRepository.updateForgottenPassword(email, newPassword);

    return JwtGenerator.generateUserBearerToken(user.userId);
  }

  public async sendForgottenPasswordEmail(email: string, secret: string): Promise<void> {
    const user = await this._userRepository.getUserByEmail(email);

    const token = JwtGenerator.generateForgottenPasswordToken(email, secret);

    try {
      await this._mailClient.sendForgottenPasswordMail(user.email, token);

      console.log(`Sent reset password email to ${user.email}`);

      return;
    } catch (error) {
      console.log(`Failed to send reset password email to ${user.email}`);

      throw new Error("Failed to send reset password email");
    }
  }
}
