import {NextFunction, Request, Response} from "express";
import Joi from "joi";
import {Middleware} from "../../domain/types/middleware.type";
import {RedisClient} from "../../external/redis/redis.client";
import {JoiValidator} from "../../lib/joi/joi.validator";
import {JwtGenerator} from "../../lib/jwt/jwt.generator";

const headersSchema = Joi.object({
  userId: Joi.string().uuid().required(),
});

export class TokenMiddleware {
  public static get middleware(): Middleware {
    return async (req: Request, res: Response, next: NextFunction) => {
      const redisClient = RedisClient.getInstance();

      const bearerToken = req.headers["authorization"];

      const token = bearerToken ? bearerToken.replace("Bearer ", "") : null;

      if (req.method === "POST" && req.path === "/user/login") {
        return next();
      }

      if (!token) {
        return res.status(401).json({
          message: "No token provided",
        });
      }

      if (req.method === "POST" && req.path === "/user/logout") {
        await redisClient.set(token, "blacklist");

        return res.status(200).json({
          message: "Logged out successfully",
        });
      }

      try {
        const redisToken = await redisClient.get(token);

        if (redisToken === "blacklist") {
          return res.status(401).json({
            message: "Token expired",
          });
        }

        const userId = JwtGenerator.getUserIdFromToken(token);

        req.headers.userId = userId;

        const result = JoiValidator.checkSchema(req.headers, headersSchema, {allowUnknown: true});

        if (result.errors || !result.value) {
          return res.status(401).json({
            message: "Invalid token",
          });
        }

        return next();
      } catch (error) {
        return res.status(401).json({
          message: "Token expired",
        });
      }
    };
  }
}
