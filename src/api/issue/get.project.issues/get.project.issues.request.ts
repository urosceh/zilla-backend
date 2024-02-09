import {Request} from "express";
import {IssueStatus} from "../../../domain/enums/IssueStatus";
import {IProjectIssueSearch} from "../../../domain/interfaces/IIssueSearch";
import {AbstractRequest} from "../../abstract/abstract.request";

export class GetProjectIssuesRequest extends AbstractRequest {
  private _projectKey: string;
  private assigneeIds: string[] | undefined;
  private reporterIds: string[] | undefined;
  private issueStatuses: IssueStatus[] | undefined;
  private sprintIds: number[] | undefined;
  private _search: string | undefined;

  private _limit: number;
  private _offset: number;
  private _orderCol: string;
  private _orderDir: string;

  constructor(request: Request) {
    super(request);

    this._projectKey = request.params.projectKey;

    this.reporterIds = request.query.reporterIds as string[];
    this.assigneeIds = request.query.assigneeIds as string[];
    this.issueStatuses = request.query.issueStatuses as unknown as IssueStatus[];
    this.sprintIds = request.query.sprintIds as unknown as number[];
    this._search = request.query.search as string;
    this._limit = request.query.limit as unknown as number;
    this._offset = request.query.offset as unknown as number;
    this._orderCol = request.query.orderCol as string;
    this._orderDir = request.query.orderDir as string;
  }

  public get projectKey(): string {
    return this._projectKey;
  }

  public get options(): IProjectIssueSearch {
    return {
      assigneeIds: this.assigneeIds,
      reporterIds: this.reporterIds,
      sprintIds: this.sprintIds,
      issueStatuses: this.issueStatuses,
      search: this._search,
      // paginatable
      limit: this._limit,
      offset: this._offset,
      orderCol: this._orderCol,
      orderDir: this._orderDir,
    };
  }
}
