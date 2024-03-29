import {IIssueRepository} from "../../database/repositories/issue.repository";
import {Issue} from "../entities/Issue";
import {IIssue} from "../interfaces/IIssue";
import {IProjectIssueSearch} from "../interfaces/IIssueSearch";

export class IssueService {
  constructor(private _issueRepository: IIssueRepository) {}

  public async createIssue(issue: IIssue): Promise<Issue> {
    return this._issueRepository.createIssue(issue);
  }

  public async getIssue(issueId: string, projectKey: string): Promise<Issue> {
    return this._issueRepository.getIssue(issueId, projectKey);
  }

  public async getAllProjectIssues(projectKey: string, options: IProjectIssueSearch): Promise<Issue[]> {
    return this._issueRepository.getAllProjectIssues(projectKey, options);
  }

  public async updateIssue(issueId: string, issue: Partial<IIssue>): Promise<Issue> {
    return this._issueRepository.updateIssue(issueId, issue);
  }
}
