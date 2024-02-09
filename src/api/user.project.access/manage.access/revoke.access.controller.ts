import {Request} from "express";
import {UserProjectAccessService} from "../../../domain/services/user.project.access.service";
import {AbstractController} from "../../abstract/abstract.controller";
import {ManageAccessRequest} from "./manage.access.request";

export class RevokeAccessController extends AbstractController {
  constructor(private _userProjectAccessService: UserProjectAccessService) {
    super();
  }

  protected async process(req: Request): Promise<{statusCode: number}> {
    const request = new ManageAccessRequest(req);

    await this._userProjectAccessService.revokeProjectAccessFromUsers(request.userIds, request.projectKey);

    return {
      statusCode: 200,
    };
  }
}
