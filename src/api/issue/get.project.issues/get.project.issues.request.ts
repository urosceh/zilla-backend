import {Request} from "express";
import {IssueStatus} from "../../../domain/enums/IssueStatus";
import {IProjectIssueSearch} from "../../../domain/interfaces/IIssueSearch";
import {AbstractRequest} from "../../abstract/abstract.request";

export class GetProjectIssuesRequest extends AbstractRequest {
  private _projectId: string;
  private assigneeIds: string[] | undefined;
  private reportedIds: string[] | undefined;
  private issueStatuses: IssueStatus[] | undefined;
  private sprintIds: number[] | undefined;
  private _search: string | undefined;

  private _limit: number;
  private _offset: number;
  private _orderCol: string;
  private _orderDir: string;

  constructor(request: Request) {
    super(request);
    this._projectId = request.params.projectId;
    this.reportedIds = request.query.reportedIds as string[];
    this.assigneeIds = request.query.assigneeIds as string[];
    this.issueStatuses = request.query.issueStatuses as unknown as IssueStatus[];
    this.sprintIds = request.query.sprintIds as unknown as number[];
    this._search = request.query.search as string;
    this._limit = request.query.limit as unknown as number;
    this._offset = request.query.offset as unknown as number;
    this._orderCol = request.query.orderCol as string;
    this._orderDir = request.query.orderDir as string;
  }

  public get projectId(): string {
    return this._projectId;
  }

  public get options(): IProjectIssueSearch {
    return {
      assigneeIds: this.assigneeIds,
      reportedIds: this.reportedIds,
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
