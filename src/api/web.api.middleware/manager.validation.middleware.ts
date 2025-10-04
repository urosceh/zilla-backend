import {NextFunction, Request, Response} from "express";
import {BadRequest, ForbiddenAccess, UnauthorizedAccess} from "../../domain/errors/errors.index";
import {projectService} from "../../domain/services.index";
import {Middleware} from "../../domain/types/Middleware";
import {GetProjectRequest} from "../project/get.project/get.project.request";

export class ManagerValidationMiddleware {
  public static get middleware(): Middleware {
    return async (req: Request, res: Response, next: NextFunction) => {
      const userId = req.headers.userId as string;
      const tenantSchemaName = req.headers.tenantSchemaName as string;
      const projectKey = (req.query.projectKey as string) || (req.body.projectKey as string);

      if (!userId) {
        return next(new UnauthorizedAccess("Unauthorized Access", {message: "Manager userId is required"}));
      }

      if (!tenantSchemaName) {
        return next(new UnauthorizedAccess("Unauthorized Access", {message: "Tenant schema name is required"}));
      }

      if (!projectKey) {
        return next(new BadRequest("projectKey is required", {message: "Project key is required"}));
      }

      // Create a mock request object for the service
      const mockReq = {
        params: {projectKey},
        headers: {userId, tenantSchemaName, tenantId: req.headers.tenantId, redisDb: req.headers.redisDb},
      } as unknown as Request;

      const getProjectRequest = new GetProjectRequest(mockReq);
      const project = await projectService.getProjectByProjectKey(getProjectRequest);

      const isManager = project.managerId === userId;

      if (!isManager) {
        return next(new ForbiddenAccess("Forbidden Access", {message: "User is not a manager"}));
      }

      return next();
    };
  }
}
