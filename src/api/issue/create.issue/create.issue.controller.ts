import {Request, Response} from "express";
import {Issue} from "../../../domain/entities/Issue";
import {IDtoable} from "../../../domain/interfaces/IReturnable";
import {IssueService} from "../../../domain/services/issue.service";
import {AbstractController} from "../../abstract/abstract.controller";
import {CreateIssueRequest} from "./create.issue.request";

export class CreateIssueController extends AbstractController {
  constructor(private _issueService: IssueService) {
    super();
  }

  protected async process(req: Request, res: Response): Promise<{statusCode: number; data: IDtoable}> {
    const request = new CreateIssueRequest(req);

    const issue: Issue = await this._issueService.createIssue(request.issue);

    return {
      statusCode: 201,
      data: issue,
    };
  }
}
