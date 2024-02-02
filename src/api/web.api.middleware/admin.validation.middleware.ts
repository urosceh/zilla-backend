import {NextFunction, Request, Response} from "express";
import {ForbiddenAccess, UnauthorizedAccess} from "../../domain/errors/errors.index";
import {adminUserService} from "../../domain/services.index";
import {Middleware} from "../../domain/types/middleware.type";

export class AdminValidationMiddleware {
  public static get middleware(): Middleware {
    return async (req: Request, res: Response, next: NextFunction) => {
      const userId = req.headers.userId as string;

      if (!userId) {
        throw new UnauthorizedAccess("Unauthorized Access", {message: "Admin userId is required"});
      }

      const isAdmin = await adminUserService.isAdmin(userId);

      if (!isAdmin) {
        throw new ForbiddenAccess("Forbidden Access", {message: "User is not an admin"});
      }

      return next();
    };
  }
}
