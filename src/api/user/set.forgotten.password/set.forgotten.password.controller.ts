import {Request, Response} from "express";
import {IBearerData} from "../../../domain/interfaces/IReturnable";
import {UserService} from "../../../domain/services/user.service";
import {IRedisClient} from "../../../external/redis/redis.client";
import {JwtGenerator} from "../../../lib/jwt/jwt.generator";
import {AbstractController} from "../../abstract/abstract.controller";
import {SetForgottenPasswordRequest} from "./set.forgotten.password.request";

export class SetForgottenPasswordController extends AbstractController {
  constructor(private _userService: UserService, private _redisClient: IRedisClient) {
    super();
  }

  protected async process(req: Request, res: Response): Promise<{statusCode: number; data?: IBearerData}> {
    const request = new SetForgottenPasswordRequest(req);

    const {email, token} = JwtGenerator.decodeForgottenPasswordToken(request.securityCode);

    const forgottenPasswordToken = await this._redisClient.getForgottenPasswordToken(email);

    if (!forgottenPasswordToken || forgottenPasswordToken !== token) {
      await this._redisClient.deleteForgottenPasswordToken(email);

      return {
        statusCode: 401,
      };
    }

    const bearerToken = await this._userService.updateForgottenPassword(email, request.newPassword);

    await this._redisClient.deleteForgottenPasswordToken(email);

    return {
      statusCode: 200,
      data: {bearerToken},
    };
  }
}
