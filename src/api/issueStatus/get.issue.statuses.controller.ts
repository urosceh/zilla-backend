import {Request, Response} from "express";
import {IssueStatus} from "../../domain/enums/IssueStatus";

export class GetIssueStatusesController {
  public async handle(req: Request, res: Response): Promise<Response> {
    const issueStatuses = Object.values(IssueStatus);

    return res.status(200).json(issueStatuses);
  }
}
