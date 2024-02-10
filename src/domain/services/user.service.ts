import {UserCreationAttributes} from "../../database/models/user.model";
import {IUserRepository} from "../../database/repositories/user.repository";
import {IMailClient} from "../../external/mail.client/mail.client";
import {JwtGenerator} from "../../lib/jwt/jwt.generator";
import {AdminBearerToken} from "../entities/AdminBearerToken";
import {AdminUser} from "../entities/AdminUser";
import {User} from "../entities/User";
import {DomainError} from "../errors/BaseError";
import {BadRequest, InternalServerError} from "../errors/errors.index";
import {IPaginatable} from "../interfaces/IPaginatable";
import {IUser} from "../interfaces/IUser";

export class UserService {
  constructor(private _userRepository: IUserRepository, private _mailClient: IMailClient) {}

  public async createUsers(users: IUser[]): Promise<User[]> {
    const userCredentials: UserCreationAttributes[] = users.map((user) => {
      return {
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        password: Math.random().toString(36).slice(-10),
      };
    });

    const createdUsers = await this._userRepository.createBatch(userCredentials);

    userCredentials.forEach((credential) => {
      this._mailClient.sendRegistrationMail(credential.email, credential.password);
    });

    return createdUsers;
  }

  public async loginUser(credentials: {email: string; password: string}): Promise<AdminBearerToken> {
    const user: AdminUser = await this._userRepository.loginUser(credentials);

    const bearerToken = JwtGenerator.generateUserBearerToken(user.userId);

    return new AdminBearerToken(bearerToken, user.isAdmin ? bearerToken : undefined);
  }

  public async updateUser(userId: string, updates: {firstName?: string; lastName?: string}): Promise<User> {
    const {firstName, lastName} = updates;

    const user = await this._userRepository.updateUser(userId, {firstName, lastName});

    return user;
  }

  public async getAllUsers(options: IPaginatable): Promise<User[]> {
    const users = await this._userRepository.getAllUsers(options);

    return users;
  }

  public async updatePassword(userId: string, passwordData: {oldPassword: string; newPassword: string}): Promise<string> {
    const {oldPassword, newPassword} = passwordData;

    if (oldPassword === newPassword) {
      throw new BadRequest("Old and New Password are the same");
    }
    if (!oldPassword || !newPassword) {
      throw new BadRequest("Old and New Password are required");
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

      if (error instanceof DomainError) {
        throw error;
      } else {
        throw new InternalServerError("Failed to send Reset Password Email", {error});
      }
    }
  }
}
