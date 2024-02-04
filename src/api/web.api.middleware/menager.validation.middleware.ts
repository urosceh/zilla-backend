import {NextFunction, Request, Response} from "express";
import {BadRequest, ForbiddenAccess, UnauthorizedAccess} from "../../domain/errors/errors.index";
import {projectService} from "../../domain/services.index";
import {Middleware} from "../../domain/types/Middleware";

export class ManagerValidationMiddleware {
  public static get middleware(): Middleware {
    return async (req: Request, res: Response, next: NextFunction) => {
      const userId = req.headers.userId as string;
      const projectKey = (req.query.projectKey as string) || (req.body.projectKey as string);

      if (!userId) {
        return next(new UnauthorizedAccess("Unauthorized Access", {message: "Manager userId is required"}));
      }

      if (!projectKey) {
        return next(new BadRequest("projectKey is required", {message: "Project key is required"}));
      }

      const project = await projectService.getProjectByProjectKey(projectKey, {withManager: false});

      const isManager = project.managerId === userId;

      if (!isManager) {
        return next(new ForbiddenAccess("Forbidden Access", {message: "User is not a manager"}));
      }

      if (!!req.body.projectKey) {
        req.body.projectId = project.projectId;
      }
      if (!!req.query.projectKey) {
        req.query.projectId = project.projectId;
      }

      return next();
    };
  }
}
