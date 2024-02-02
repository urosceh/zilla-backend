import {NextFunction, Request, Response} from "express";
import {UserProjectAccess} from "../../domain/entities/UserProjectAccess";
import {userProjectAccessService} from "../../domain/services.index";
import {Middleware} from "../../domain/types/middleware.type";

export class AccessValidationMiddleware {
  public static get middleware(): Middleware {
    return async (req: Request, res: Response, next: NextFunction) => {
      const userId = req.headers.userId as string;
      const projectKey = (req.query.projectKey as string) || (req.body.projectKey as string);

      if (!userId) {
        return res.status(401).json({
          message: "Project Access ID is required",
        });
      }

      if (projectKey) {
        try {
          const userProjectAccess: UserProjectAccess = await userProjectAccessService.getUserProjectAccess(userId, projectKey);

          if (!!req.body.projectKey) {
            req.body.projectId = userProjectAccess.project.projectId;
          }
          if (!!req.query.projectKey) {
            req.query.projectId = userProjectAccess.project.projectId;
          }

          return next();
        } catch (error) {
          return res.status(403).json({
            message: "Access denied",
          });
        }
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
