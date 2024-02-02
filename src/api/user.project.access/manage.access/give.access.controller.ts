import {Request, Response} from "express";
import {UserProjectAccessService} from "../../../domain/services/user.project.access.service";
import {AbstractController} from "../../abstract/abstract.controller";
import {ManageAccessRequest} from "./manage.access.request";

export class GiveAccessController extends AbstractController {
  constructor(private _userProjectAccessService: UserProjectAccessService) {
    super();
  }

  protected async process(req: Request, res: Response): Promise<{statusCode: number}> {
    const request = new ManageAccessRequest(req);

    await this._userProjectAccessService.giveProjectAccessToUsers(request.userIds, request.projectKey);

    return {
      statusCode: 201,
    };
  }
}
