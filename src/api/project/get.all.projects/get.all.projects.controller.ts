import {Request, Response} from "express";
import {IReturnable} from "../../../domain/interfaces/IReturnable";
import {UserProjectAccessService} from "../../../domain/services/user.project.access.service";
import {AbstractController} from "../../abstract/abstract.controller";
import {GetAllProjectsRequest} from "./get.all.projects.request";

export class GetAllProjectsController extends AbstractController {
  constructor(private _userProjectAccessService: UserProjectAccessService) {
    super();
  }

  protected async process(req: Request, res: Response): Promise<{statusCode: number; data: IReturnable[]}> {
    const request = new GetAllProjectsRequest(req);

    const projects = await this._userProjectAccessService.getAllAccessableProjects(request.accessUserId, request.options);

    return {
      statusCode: 200,
      data: projects,
    };
  }
}
