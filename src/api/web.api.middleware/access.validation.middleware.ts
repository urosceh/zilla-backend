import {NextFunction, Request, Response} from "express";
import {UserProjectAccess} from "../../domain/entities/UserProjectAccess";
import {BadRequest, ForbiddenAccess, UnauthorizedAccess} from "../../domain/errors/errors.index";
import {userProjectAccessService} from "../../domain/services.index";
import {Middleware} from "../../domain/types/Middleware";

export class AccessValidationMiddleware {
  public static get middleware(): Middleware {
    return async (req: Request, res: Response, next: NextFunction) => {
      const userId = req.headers.userId as string;
      const tenantSchemaName = req.headers.tenantSchemaName as string;
      const projectKey = (req.query.projectKey as string) || (req.body.projectKey as string) || (req.params.projectKey as string);

      if (!userId) {
        return next(new UnauthorizedAccess("Unauthorized Access", {message: "User Id is required"}));
      }

      if (!tenantSchemaName) {
        return next(new UnauthorizedAccess("Unauthorized Access", {message: "Tenant schema name is required"}));
      }

      if (projectKey) {
        try {
          const userProjectAccess: UserProjectAccess = await userProjectAccessService.getUserProjectAccess(
            userId,
            projectKey,
            tenantSchemaName
          );

          return next();
        } catch (error) {
          return next(new ForbiddenAccess("Forbidden Access", {message: "User does not have access to this project"}));
        }
      } else {
        if (req.method !== "GET" || req.path !== "/all") {
          return next(new BadRequest("Project Key is required", {message: "Project Key is required"}));
        }

        return next();
      }
    };
  }
}
