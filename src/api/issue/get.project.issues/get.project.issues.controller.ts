import {Request} from "express";
import {IDtoable} from "../../../domain/interfaces/IReturnable";
import {IssueService} from "../../../domain/services/issue.service";
import {AbstractController} from "../../abstract/abstract.controller";
import {GetProjectIssuesRequest} from "./get.project.issues.request";

export class GetProjectIssuesController extends AbstractController {
  constructor(private _issueService: IssueService) {
    super();
  }

  protected async process(req: Request): Promise<{statusCode: number; data: IDtoable[]}> {
    const request = new GetProjectIssuesRequest(req);

    const issues = await this._issueService.getAllProjectIssues(request.projectKey, request.options);

    return {
      statusCode: 200,
      data: issues,
    };
  }
}
