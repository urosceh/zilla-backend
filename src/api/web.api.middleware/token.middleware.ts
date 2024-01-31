import {NextFunction, Request, Response} from "express";
import Joi from "joi";
import {Middleware} from "../../domain/types/middleware.type";
import {JoiValidator} from "../../lib/joi/joi.validator";
import {JwtGenerator} from "../../lib/jwt/jwt.generator";

const accessIdQuerySchema = Joi.object({
  access_id: Joi.string().uuid().required(),
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

      const user_id = JwtGenerator.getUserIdFromToken(token);

      req.query.access_id = user_id;

      const result = JoiValidator.checkSchema(req.query, accessIdQuerySchema);

      if (result.errors || !result.value) {
        return res.status(401).json({
          message: "Invalid token",
        });
      }

      return next();
    };
  }
}
