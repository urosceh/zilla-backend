import {Request, Response} from "express";
import {ProjectService} from "../../../domain/services/project.service";
import {AbstractController} from "../../abstract.controller";
import {CreateProjectRequest} from "./create.project.request";

export class CreateProjectController extends AbstractController {
  constructor(private _projectService: ProjectService) {
    super();
  }

  protected async process(req: Request, res: Response): Promise<Response> {
    const request = new CreateProjectRequest(req);

    const project = await this._projectService.createProject(request);

    return res.status(201).json(project);
  }
}
