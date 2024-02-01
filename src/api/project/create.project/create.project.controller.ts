import {Request, Response} from "express";
import {ProjectWithManager} from "../../../domain/entities/ProjectWithManager";
import {IReturnable} from "../../../domain/interfaces/IReturnable";
import {ProjectService} from "../../../domain/services/project.service";
import {AbstractController} from "../../abstract/abstract.controller";
import {CreateProjectRequest} from "./create.project.request";

export class CreateProjectController extends AbstractController {
  constructor(private _projectService: ProjectService) {
    super();
  }

  protected async process(req: Request, res: Response): Promise<{statusCode: number; data: IReturnable}> {
    const request = new CreateProjectRequest(req);

    const project: ProjectWithManager = await this._projectService.createProject(request);

    return {
      statusCode: 201,
      data: project,
    };
  }
}
