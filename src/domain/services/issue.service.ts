import {IIssueRepository} from "../../database/repositories/issue.repository";
import {Issue} from "../entities/Issue";
import {IIssue} from "../interfaces/IIssue";

export class IssueService {
  constructor(private _issueRepository: IIssueRepository) {}

  public async createIssue(issue: IIssue): Promise<Issue> {
    return this._issueRepository.createIssue(issue);
  }

  public async getIssue(issueId: string, projectId: string): Promise<Issue> {
    return this._issueRepository.getIssue(issueId, projectId);
  }
}
