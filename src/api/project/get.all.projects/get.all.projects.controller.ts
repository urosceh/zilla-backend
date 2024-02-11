import {Request} from "express";
import {ProjectWithManager} from "../../../domain/entities/ProjectWithManager";
import {IDtoable} from "../../../domain/interfaces/IReturnable";
import {UserProjectAccessService} from "../../../domain/services/user.project.access.service";
import {AbstractController} from "../../abstract/abstract.controller";
import {GetAllProjectsRequest} from "./get.all.projects.request";

export class GetAllProjectsController extends AbstractController {
  constructor(private _userProjectAccessService: UserProjectAccessService) {
    super();
  }

  protected async process(req: Request): Promise<{statusCode: number; data: IDtoable[]}> {
    const request = new GetAllProjectsRequest(req);

    const projects: ProjectWithManager[] = await this._userProjectAccessService.getAllAccessableProjects(
      request.accessUserId,
      request.options
    );

    projects.forEach((project) => {
      project.isManager = project.manager?.userId === request.accessUserId;
    });

    return {
      statusCode: 200,
      data: projects,
    };
  }
}
