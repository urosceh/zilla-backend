import {Request, Response} from "express";
import crypto from "node:crypto";
import {UserService} from "../../../domain/services/user.service";
import {IRedisClient} from "../../../external/redis/redis.client";
import {AbstractController} from "../../abstract/abstract.controller";
import {ForgottenPasswordRequest} from "./forgotten.password.request";

export class ForgottenPasswordController extends AbstractController {
  constructor(private _userService: UserService, private _redisClient: IRedisClient) {
    super();
  }

  protected async process(req: Request, res: Response): Promise<{statusCode: number}> {
    const request = new ForgottenPasswordRequest(req);

    const secret = crypto.randomBytes(20).toString("hex");

    await this._userService.sendForgottenPasswordEmail(request.email, secret);

    await this._redisClient.setForgottenPasswordToken(request.email, secret);

    return {
      statusCode: 200,
    };
  }
}
