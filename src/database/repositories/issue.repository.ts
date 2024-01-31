import {Issue} from "../../domain/entities/Issue";
import IssueModel, {IssueCreationAttributes, IssueOrderAttributes} from "../models/issue.model";
import SprintModel from "../models/sprint.model";
import UserModel from "../models/user.model";

export interface IIssueRepository {
  createIssue(issue: IssueCreationAttributes): Promise<Issue>;
  getAllProjectIssues(
    projectId: string,
    options: {limit: number; offset: number; orderCol?: IssueOrderAttributes; orderDir?: "ASC" | "DESC"}
  ): Promise<Issue[]>;
}

export class IssueRepository implements IIssueRepository {
  public async createIssue(issue: IssueCreationAttributes): Promise<Issue> {
    const createdIssue = await IssueModel.create(issue);

    return new Issue(createdIssue);
  }

  public async getAllProjectIssues(
    projectId: string,
    options: {limit: number; offset: number; orderCol?: IssueOrderAttributes; orderDir?: "ASC" | "DESC"}
  ): Promise<Issue[]> {
    const order: any = [[options.orderCol || "createdAt", options.orderDir || "ASC"]];

    const issues = await IssueModel.findAll({
      where: {
        projectId,
      },
      limit: options.limit,
      offset: options.offset,
      order,
      include: [
        {
          model: UserModel,
          as: "reporter",
        },
        {
          model: UserModel,
          as: "assignee",
        },
        {
          model: SprintModel,
          as: "sprint",
        },
      ],
    });

    return issues.map((issue) => new Issue(issue));
  }
}
