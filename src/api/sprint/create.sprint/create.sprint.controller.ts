import {Request} from "express";
import {Sprint} from "../../../domain/entities/Sprint";
import {IDtoable} from "../../../domain/interfaces/IReturnable";
import {SprintService} from "../../../domain/services/sprint.service";
import {AbstractController} from "../../abstract/abstract.controller";
import {CreateSprintRequest} from "./create.sprint.request";

export class CreateSprintController extends AbstractController {
  constructor(private _sprintService: SprintService) {
    super();
  }

  protected async process(req: Request): Promise<{statusCode: number; data: IDtoable}> {
    const request = new CreateSprintRequest(req);

    const sprint: Sprint = await this._sprintService.createSprint(request.sprint);

    return {
      statusCode: 201,
      data: sprint,
    };
  }
}
