import {Request, Response} from "express";
import {ProjectWithManager} from "../../../domain/entities/ProjectWithManager";
import {IDtoable} from "../../../domain/interfaces/IReturnable";
import {ProjectService} from "../../../domain/services/project.service";
import {AbstractController} from "../../abstract/abstract.controller";
import {GetProjectRequest} from "./get.project.request";

export class GetProjectController extends AbstractController {
  constructor(private _projectService: ProjectService) {
    super();
  }

  protected async process(req: Request, res: Response): Promise<{statusCode: number; data: IDtoable}> {
    const request = new GetProjectRequest(req);

    const project: ProjectWithManager = await this._projectService.getProjectByProjectKey(request.projectKey);

    if (project.managerId === request.accessUserId) {
      project.isManager = true;
    }

    return {
      statusCode: 200,
      data: project,
    };
  }
}
