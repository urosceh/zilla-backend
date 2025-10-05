import {NextFunction, Request, Response} from "express";
import {ForbiddenAccess, UnauthorizedAccess} from "../../domain/errors/errors.index";
import {adminUserService} from "../../domain/services.index";
import {Middleware} from "../../domain/types/Middleware";

export class AdminValidationMiddleware {
  public static get middleware(): Middleware {
    return async (req: Request, res: Response, next: NextFunction) => {
      const userId = req.headers.userId as string;
      const tenantId = req.headers.tenantId as string;

      if (!userId) {
        return next(new UnauthorizedAccess("Unauthorized Access", {message: "Admin userId is required"}));
      }

      if (!tenantId) {
        return next(new UnauthorizedAccess("Unauthorized Access", {message: "Tenant Id is required"}));
      }

      const isAdmin = await adminUserService.isAdmin(userId, tenantId);

      if (!isAdmin) {
        return next(new ForbiddenAccess("Forbidden Access", {message: "User is not an admin"}));
      }

      return next();
    };
  }
}
