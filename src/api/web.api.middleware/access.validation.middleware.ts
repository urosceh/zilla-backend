import {NextFunction, Request, Response} from "express";
import {userProjectAccessService} from "../../domain/services.index";
import {Middleware} from "../../domain/types/middleware.type";

export class AccessValidationMiddleware {
  public static get middleware(): Middleware {
    return async (req: Request, res: Response, next: NextFunction) => {
      const userId = req.headers.userId as string;
      const projectKey = req.query.projectKey as string;

      if (!userId) {
        return res.status(401).json({
          message: "Project Access ID is required",
        });
      }

      if (projectKey) {
        const hasAccess = await userProjectAccessService.hasAccessToProject(userId, projectKey);

        if (!hasAccess) {
          return res.status(403).json({
            message: "Access denied",
          });
        }

        return next();
      } else {
        if (req.method !== "GET" || req.path !== "/all") {
          return res.status(400).json({
            message: "Project key is required",
          });
        }

        return next();
      }
    };
  }
}
