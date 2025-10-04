import {NextFunction, Request, Response} from "express";
import {ForbiddenAccess, UnauthorizedAccess} from "../../domain/errors/errors.index";
import {adminUserService} from "../../domain/services.index";
import {Middleware} from "../../domain/types/Middleware";

export class AdminValidationMiddleware {
  public static get middleware(): Middleware {
    return async (req: Request, res: Response, next: NextFunction) => {
      const userId = req.headers.userId as string;
      const tenantSchemaName = req.headers.tenantSchemaName as string;

      if (!userId) {
        return next(new UnauthorizedAccess("Unauthorized Access", {message: "Admin userId is required"}));
      }

      if (!tenantSchemaName) {
        return next(new UnauthorizedAccess("Unauthorized Access", {message: "Tenant schema name is required"}));
      }

      const isAdmin = await adminUserService.isAdmin(userId, tenantSchemaName);

      if (!isAdmin) {
        return next(new ForbiddenAccess("Forbidden Access", {message: "User is not an admin"}));
      }

      return next();
    };
  }
}
