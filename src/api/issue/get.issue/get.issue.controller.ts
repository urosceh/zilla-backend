import {Request} from "express";
import {Issue} from "../../../domain/entities/Issue";
import {IDtoable} from "../../../domain/interfaces/IReturnable";
import {IssueService} from "../../../domain/services/issue.service";
import {AbstractController} from "../../abstract/abstract.controller";
import {GetIssueRequest} from "./get.issue.request";

export class GetIssueController extends AbstractController {
  constructor(private _issueService: IssueService) {
    super();
  }

  protected async process(req: Request): Promise<{statusCode: number; data: IDtoable}> {
    const request = new GetIssueRequest(req);

    const issue: Issue = await this._issueService.getIssue(request.issueId, request.projectKey);

    return {
      statusCode: 200,
      data: issue,
    };
  }
}
