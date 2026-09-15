import {Op, Transaction} from "sequelize";
import {Sprint} from "../../domain/entities/Sprint";
import {SprintWithIssues} from "../../domain/entities/SprintWithIssues";
import {NotFound} from "../../domain/errors/errors.index";
import IssueModel from "../models/issue.model";
import SprintModel, {SprintCreationAttributes} from "../models/sprint.model";

export interface ISprintRepository {
  createSprint(sprint: SprintCreationAttributes, transaction: Transaction): Promise<Sprint>;
  getProjectSprints(projectKey: string, transaction: Transaction): Promise<Sprint[]>;
  getCurrentSprintIssues(projectId: string, transaction: Transaction): Promise<SprintWithIssues>;
}

export class SprintRepository implements ISprintRepository {
  public async createSprint(sprint: SprintCreationAttributes, transaction: Transaction): Promise<Sprint> {
    const sprintModel = await SprintModel.create(sprint, {transaction});

    return new Sprint(sprintModel);
  }

  public async getProjectSprints(projectKey: string, transaction: Transaction): Promise<Sprint[]> {
    const sprints = await SprintModel.findAll({
      where: {
        projectKey,
      },
      transaction,
    });

    return sprints.map((sprint) => new Sprint(sprint));
  }

  public async getCurrentSprintIssues(projectId: string, transaction: Transaction): Promise<SprintWithIssues> {
    const sprintWithIssues = await SprintModel.findOne({
      where: {
        [Op.and]: {
          projectKey: projectId,
          [Op.and]: {
            startOfSprint: {
              [Op.lte]: new Date(),
            },
            endOfSprint: {
              [Op.gt]: new Date(),
            },
          },
        },
      },
      include: [
        {
          model: IssueModel,
          as: "issues",
        },
      ],
      transaction,
    });

    if (!sprintWithIssues) {
      throw new NotFound("Sprint with Issues Not Found", {method: this.getCurrentSprintIssues.name, projectId});
    }

    return new SprintWithIssues(sprintWithIssues);
  }
}
