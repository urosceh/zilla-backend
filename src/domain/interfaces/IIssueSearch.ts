import {IssueStatus} from "../enums/IssueStatus";
import {IPaginatable} from "./IPaginatable";

export interface IIssueSearch extends IPaginatable {
  issueStatuses?: IssueStatus[];
  search?: string;
}

export interface IProjectIssueSearch extends IIssueSearch {
  assigneeIds?: string[];
  reportedIds?: string[];
  sprintIds?: number[];
}
