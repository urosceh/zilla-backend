import {Request} from "express";
import {IDtoable} from "../../../domain/interfaces/IReturnable";
import {IssueService} from "../../../domain/services/issue.service";
import {AbstractController} from "../../abstract/abstract.controller";
import {UpdateIssueRequest} from "./update.issue.request";

export class UpdateIssueController extends AbstractController {
  constructor(private _issueService: IssueService) {
    super();
  }

  protected async process(req: Request): Promise<{statusCode: number; data: IDtoable}> {
    const request = new UpdateIssueRequest(req);

    const issue = await this._issueService.updateIssue(request);

    return {
      statusCode: 200,
      data: issue,
    };
  }
}
