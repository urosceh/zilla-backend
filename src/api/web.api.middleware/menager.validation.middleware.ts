import {NextFunction, Request, Response} from "express";
import {projectService} from "../../domain/services.index";
import {Middleware} from "../../domain/types/middleware.type";

export class ManagerValidationMiddleware {
  public static get middleware(): Middleware {
    return async (req: Request, res: Response, next: NextFunction) => {
      const userId = req.headers.userId as string;
      const projectKey = req.query.projectKey as string;

      if (!userId) {
        return res.status(401).json({
          message: "Manager Access ID is required",
        });
      }

      if (!projectKey) {
        return res.status(400).json({
          message: "Project key is required",
        });
      }

      const isManager = await projectService.isManager(projectKey, userId);

      if (!isManager) {
        return res.status(403).json({
          message: "Access denied",
        });
      }

      return next();
    };
  }
}
