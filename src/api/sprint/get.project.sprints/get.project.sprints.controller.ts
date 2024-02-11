import {Request} from "express";
import {IDtoable} from "../../../domain/interfaces/IReturnable";
import {SprintService} from "../../../domain/services/sprint.service";
import {AbstractController} from "../../abstract/abstract.controller";
import {GetProjectSprintsRequest} from "./get.project.sprints.request";

export class GetProjectSprintsController extends AbstractController {
  constructor(private _sprintService: SprintService) {
    super();
  }

  protected async process(req: Request): Promise<{statusCode: number; data: IDtoable[]}> {
    const request = new GetProjectSprintsRequest(req);

    const sprints = await this._sprintService.getProjectSprints(request.projectKey);

    return {
      statusCode: 200,
      data: sprints,
    };
  }
}
