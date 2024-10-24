import {NextFunction, Request, Response} from "express";
import Joi from "joi";
import {UnauthorizedAccess} from "../../domain/errors/errors.index";
import {Middleware} from "../../domain/types/Middleware";
import {IRedisClient, RedisClient} from "../../external/redis/redis.client";
import {JoiValidator} from "../../lib/joi/joi.validator";
import {JwtGenerator} from "../../lib/jwt/jwt.generator";

const headersSchema = Joi.object({
  userId: Joi.string().uuid().required(),
});

export class TokenMiddleware {
  public static get middleware(): Middleware {
    return async (req: Request, res: Response, next: NextFunction) => {
      const redisClient: IRedisClient = RedisClient.getInstance();

      const bearerToken = req.headers["authorization"];

      const token = bearerToken ? bearerToken.replace("Bearer ", "") : null;

      if (
        (req.method === "POST" && req.path === "/user/login") ||
        (req.method === "POST" && req.path === "/user/set-forgotten-password") ||
        (req.method === "GET" && req.path === "/health")
      ) {
        return next();
      }

      if (!token) {
        console.warn("Token is required", req.method, req.path);
        return next(new UnauthorizedAccess("Unauthorized Access", {message: "Token is required"}));
      }

      if (req.method === "POST" && req.path === "/user/logout") {
        await redisClient.setBlacklistedToken(token);

        return res.status(200).json({
          message: "Logged out successfully",
        });
      }

      try {
        const isBlacklistedToken = await redisClient.isBlacklistedToken(token);

        if (isBlacklistedToken) {
          return next(new UnauthorizedAccess("Unauthorized Access", {message: "Token is blacklisted"}));
        }

        const userId = JwtGenerator.getUserIdFromToken(token);

        req.headers.userId = userId;

        const result = JoiValidator.checkSchema(req.headers, headersSchema, {allowUnknown: true});

        if (result.errors || !result.value) {
          return next(new UnauthorizedAccess("Unauthorized Access", {message: "Invalid headers"}));
        }

        return next();
      } catch (error) {
        return next(new UnauthorizedAccess("Unauthorized Access", {message: "Token expired or invalid"}));
      }
    };
  }
}
