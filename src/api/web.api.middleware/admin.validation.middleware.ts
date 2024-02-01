import {NextFunction, Request, Response} from "express";
import {adminUserService} from "../../domain/services.index";
import {Middleware} from "../../domain/types/middleware.type";

export class AdminValidationMiddleware {
  public static get middleware(): Middleware {
    return async (req: Request, res: Response, next: NextFunction) => {
      const userId = req.headers.userId as string;

      if (!userId) {
        return res.status(401).json({
          message: "Admin Access ID is required",
        });
      }

      const isAdmin = await adminUserService.isAdmin(userId);

      if (!isAdmin) {
        return res.status(403).json({
          message: "Access denied",
        });
      }

      return next();
    };
  }
}
