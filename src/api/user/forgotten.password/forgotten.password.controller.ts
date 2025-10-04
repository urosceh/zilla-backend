import {Request} from "express";
import crypto from "node:crypto";
import {UserService} from "../../../domain/services/user.service";
import {IRedisClient} from "../../../external/redis/redis.client";
import {AbstractController} from "../../abstract/abstract.controller";
import {ForgottenPasswordRequest} from "./forgotten.password.request";

export class ForgottenPasswordController extends AbstractController {
  constructor(private _userService: UserService, private _redisClient: IRedisClient) {
    super();
  }

  protected async process(req: Request): Promise<{statusCode: number}> {
    const request = new ForgottenPasswordRequest(req);

    const secret = crypto.randomBytes(20).toString("hex");

    try {
      await this._redisClient.setForgottenPasswordToken(request.redisDb, request.email, secret);

      await this._userService.sendForgottenPasswordEmail(request, secret);

      return {
        statusCode: 200,
      };
    } catch (error) {
      await this._redisClient.deleteForgottenPasswordToken(request.redisDb, request.email);

      throw error;
    }
  }
}
