import {NextFunction, Request, Response} from "express";
import Joi from "joi";
import {Middleware} from "../../domain/types/middleware.type";
import {JoiValidator} from "../../lib/joi/joi.validator";
import {JwtGenerator} from "../../lib/jwt/jwt.generator";

const headersSchema = Joi.object({
  userId: Joi.string().uuid().required(),
});

export class TokenMiddleware {
  public static get middleware(): Middleware {
    return async (req: Request, res: Response, next: NextFunction) => {
      if (req.method === "POST" && req.path === "/user/login") {
        return next();
      }

      const token = req.headers["authorization"];

      if (!token) {
        return res.status(401).json({
          message: "No token provided",
        });
      }

      const userId = JwtGenerator.getUserIdFromToken(token);

      // redis has active set for certain duration
      // after that it's deleted
      // on logout, it's set as blacklisted
      // check redis (exists and active token)

      req.headers.userId = userId;

      const result = JoiValidator.checkSchema(req.headers, headersSchema, {allowUnknown: true});

      if (result.errors || !result.value) {
        return res.status(401).json({
          message: "Invalid token",
        });
      }

      return next();
    };
  }
}
