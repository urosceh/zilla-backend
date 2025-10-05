import {CreateIssueRequest} from "../../api/issue/create.issue/create.issue.request";
import {GetIssueRequest} from "../../api/issue/get.issue/get.issue.request";
import {GetProjectIssuesRequest} from "../../api/issue/get.project.issues/get.project.issues.request";
import {UpdateIssueRequest} from "../../api/issue/update.issue/update.issue.request";
import {IIssueRepository} from "../../database/repositories/issue.repository";
import {TransactionManager} from "../../database/transaction.manager";
import {Issue} from "../entities/Issue";

export class IssueService {
  constructor(private _issueRepository: IIssueRepository) {}

  public async createIssue(request: CreateIssueRequest): Promise<Issue> {
    const transaction = await TransactionManager.createTenantTransaction(request.tenantId);

    try {
      const issue = await this._issueRepository.createIssue(request.issue, transaction);
      await transaction.commit();
      return issue;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  public async getIssue(request: GetIssueRequest): Promise<Issue> {
    const transaction = await TransactionManager.createTenantTransaction(request.tenantId);

    try {
      const issue = await this._issueRepository.getIssue(request.issueId, request.projectKey, transaction);
      await transaction.commit();
      return issue;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  public async getAllProjectIssues(request: GetProjectIssuesRequest): Promise<Issue[]> {
    const transaction = await TransactionManager.createTenantTransaction(request.tenantId);

    try {
      const issues = await this._issueRepository.getAllProjectIssues(request.projectKey, request.options, transaction);
      await transaction.commit();
      return issues;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  public async updateIssue(request: UpdateIssueRequest): Promise<Issue> {
    const transaction = await TransactionManager.createTenantTransaction(request.tenantId);

    try {
      const issue = await this._issueRepository.updateIssue(request.issueId, request.issue, transaction);
      await transaction.commit();
      return issue;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }
}
