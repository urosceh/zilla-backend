import {ChangePasswordRequest} from "../../api/user/change.password/change.password.request";
import {CreateUsersRequest} from "../../api/user/create.users/create.users.request";
import {ForgottenPasswordRequest} from "../../api/user/forgotten.password/forgotten.password.request";
import {GetAllUsersRequest} from "../../api/user/get.all.users/get.all.users.request";
import {LoginUserRequest} from "../../api/user/login.user/login.user.request";
import {SetForgottenPasswordRequest} from "../../api/user/set.forgotten.password/set.forgotten.password.request";
import {UpdateUserRequest} from "../../api/user/update.user/update.user.request";
import {UserCreationAttributes} from "../../database/models/user.model";
import {IUserRepository} from "../../database/repositories/user.repository";
import {TransactionManager} from "../../database/transaction.manager";
import {IMailClient} from "../../external/mail/mail.client.interface";
import {JwtGenerator} from "../../lib/jwt/jwt.generator";
import {AdminBearerToken} from "../entities/AdminBearerToken";
import {AdminUser} from "../entities/AdminUser";
import {User} from "../entities/User";
import {DomainError} from "../errors/BaseError";
import {BadRequest, InternalServerError} from "../errors/errors.index";

export class UserService {
  constructor(private _userRepository: IUserRepository, private _mailClient: IMailClient) {}

  public async createUsers(request: CreateUsersRequest): Promise<User[]> {
    const transaction = await TransactionManager.createTenantTransaction(request.tenantSchemaName);

    try {
      const userCredentials: UserCreationAttributes[] = request.users.map((user) => {
        return {
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          password: Math.random().toString(36).slice(-10),
        };
      });

      const createdUsers = await this._userRepository.createBatch(userCredentials, transaction);

      userCredentials.forEach((credential) => {
        this._mailClient.sendRegistrationMail(credential.email, credential.password);
      });

      await transaction.commit();
      return createdUsers;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  public async loginUser(request: LoginUserRequest): Promise<AdminBearerToken> {
    const transaction = await TransactionManager.createTenantTransaction(request.tenantSchemaName);

    try {
      const user: AdminUser = await this._userRepository.loginUser(request.credentials, transaction);

      const bearerToken = JwtGenerator.generateUserBearerToken(user.userId, request.tenantId);

      await transaction.commit();
      return new AdminBearerToken(bearerToken, user.isAdmin ? bearerToken : undefined);
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  public async updateUser(request: UpdateUserRequest): Promise<User> {
    const transaction = await TransactionManager.createTenantTransaction(request.tenantSchemaName);

    try {
      const {firstName, lastName} = request.updates;

      const user = await this._userRepository.updateUser(request.accessUserId, {firstName, lastName}, transaction);

      await transaction.commit();
      return user;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  public async getAllUsers(request: GetAllUsersRequest): Promise<User[]> {
    const transaction = await TransactionManager.createTenantTransaction(request.tenantSchemaName);

    try {
      const users = await this._userRepository.getAllUsers(request.options, transaction);
      await transaction.commit();
      return users;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  public async updatePassword(request: ChangePasswordRequest): Promise<string> {
    const {oldPassword, newPassword} = request.passwordData;

    if (oldPassword === newPassword) {
      throw new BadRequest("Old and New Password are the same");
    }
    if (!oldPassword || !newPassword) {
      throw new BadRequest("Old and New Password are required");
    }

    const transaction = await TransactionManager.createTenantTransaction(request.tenantSchemaName);

    try {
      const user = await this._userRepository.updatePassword(request.accessUserId, {oldPassword, newPassword}, transaction);
      await transaction.commit();
      return JwtGenerator.generateUserBearerToken(user.userId, request.tenantId);
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  public async updateForgottenPassword(email: string, request: SetForgottenPasswordRequest): Promise<string> {
    const transaction = await TransactionManager.createTenantTransaction(request.tenantSchemaName);

    try {
      const user = await this._userRepository.updateForgottenPassword(email, request.newPassword, transaction);
      await transaction.commit();
      return JwtGenerator.generateUserBearerToken(user.userId, request.tenantId);
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  public async sendForgottenPasswordEmail(request: ForgottenPasswordRequest, secret: string): Promise<void> {
    const transaction = await TransactionManager.createTenantTransaction(request.tenantSchemaName);

    try {
      const user = await this._userRepository.getUserByEmail(request.email, transaction);

      const token = JwtGenerator.generateForgottenPasswordToken(request.email, secret);

      await this._mailClient.sendForgottenPasswordMail(user.email, token);

      console.log(`Sent reset password email to ${user.email}`);

      await transaction.commit();
      return;
    } catch (error) {
      await transaction.rollback();
      console.log(`Failed to send reset password email to ${request.email}`);

      if (error instanceof DomainError) {
        throw error;
      } else {
        throw new InternalServerError("Failed to send Reset Password Email", {error});
      }
    }
  }
}
