import {Request} from "express";
import {Project} from "../../../domain/entities/Project";
import {IDtoable} from "../../../domain/interfaces/IReturnable";
import {ProjectService} from "../../../domain/services/project.service";
import {AbstractController} from "../../abstract/abstract.controller";
import {CreateProjectRequest} from "./create.project.request";

export class CreateProjectController extends AbstractController {
  constructor(private _projectService: ProjectService) {
    super();
  }

  protected async process(req: Request): Promise<{statusCode: number; data: IDtoable}> {
    const request = new CreateProjectRequest(req);

    const project: Project = await this._projectService.createProject(request);

    return {
      statusCode: 201,
      data: project,
    };
  }
}
