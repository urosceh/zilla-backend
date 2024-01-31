import {Request, Response} from "express";
import {AdminUserService} from "../../../domain/services/admin.user.service";
import {ProjectService} from "../../../domain/services/project.service";
import {AdminAbstractController} from "../../abstract/admin.abstract.controller";
import {CreateProjectRequest} from "./create.project.request";

export class CreateProjectController extends AdminAbstractController {
  constructor(private _projectService: ProjectService, adminUserService: AdminUserService) {
    super(adminUserService);
  }

  protected async process(req: Request, res: Response): Promise<Response> {
    const request = new CreateProjectRequest(req);

    const isAdmin = await this.isAdminUser(request.adminUserId);

    if (!isAdmin) {
      return res.status(403).json({
        message: "You are not authorized to create projects",
      });
    }

    const project = await this._projectService.createProject(request);

    return res.status(201).json(project);
  }
}
