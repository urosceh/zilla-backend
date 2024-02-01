import {Request, Response} from "express";
import {ProjectService} from "../../../domain/services/project.service";
import {UserProjectAccessService} from "../../../domain/services/user.project.access.service";
import {ManagerAbstractController} from "../../abstract/manager.abstract.controller";
import {GiveAccessRequest} from "./give.access.request";

export class GiveAccessController extends ManagerAbstractController {
  constructor(private _userProjectAccessService: UserProjectAccessService, projectService: ProjectService) {
    super(projectService);
  }

  protected async process(req: Request, res: Response): Promise<Response> {
    const request = new GiveAccessRequest(req);

    const isManager = await this.isManager(request.projectKey, request.accessUserId);

    if (!isManager) {
      return res.status(403).json({
        message: "You are not authorized to give access to users",
      });
    }

    const userProjectAccess = await this._userProjectAccessService.giveProjectAccessToUsers(request.userIds, request.projectKey);

    return res.status(201).json(userProjectAccess);
  }
}
