import {Op} from "sequelize";
import {Issue} from "../../domain/entities/Issue";
import {NotFound} from "../../domain/errors/errors.index";
import {IProjectIssueSearch} from "../../domain/interfaces/IIssueSearch";
import IssueModel, {IssueCreationAttributes} from "../models/issue.model";
import ProjectModel from "../models/project.model";
import SprintModel from "../models/sprint.model";
import UserModel from "../models/user.model";

export interface IIssueRepository {
  createIssue(issue: IssueCreationAttributes): Promise<Issue>;
  getIssue(issueId: string, projectKey: string): Promise<Issue>;
  getAllProjectIssues(projectKey: string, options: IProjectIssueSearch): Promise<Issue[]>;
}

export class IssueRepository implements IIssueRepository {
  public async createIssue(issue: IssueCreationAttributes): Promise<Issue> {
    const createdIssue = await IssueModel.create(issue);

    return new Issue(createdIssue);
  }

  public async getIssue(issueId: string, projectKey: string): Promise<Issue> {
    const issue = await IssueModel.findOne({
      where: {
        issueId,
        projectKey,
      },
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
        {
          model: ProjectModel,
          as: "project",
        },
      ],
    });

    if (!issue) {
      throw new NotFound("Issue Not Found", {method: this.getIssue.name, issueId, projectKey});
    }

    return new Issue(issue);
  }

  public async getAllProjectIssues(projectKey: string, options: IProjectIssueSearch): Promise<Issue[]> {
    const orderCol = ["createdAt", "updatedAt"].includes(options.orderCol) ? options.orderCol : "updatedAt";
    const orderDir = ["ASC", "DESC"].includes(options.orderDir) ? options.orderDir : "ASC";

    const whereCondition = {
      [Op.and]: [
        {projectKey},
        options.sprintIds ? {sprintId: {[Op.in]: options.sprintIds}} : {},
        options.reportedIds ? {reporterId: {[Op.in]: options.reportedIds}} : {},
        options.assigneeIds ? {assigneeId: {[Op.in]: options.assigneeIds}} : {},
        options.issueStatuses ? {issueStatus: {[Op.in]: options.issueStatuses}} : {},
        options.search ? {summary: {[Op.iLike]: `%${options.search}%`}} : {},
      ],
    };

    const issues = await IssueModel.findAll({
      where: whereCondition,
      limit: options.limit,
      offset: options.offset,
      order: [[orderCol, orderDir]],
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
