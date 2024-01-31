import {Op} from "sequelize";
import {Sprint} from "../../domain/entities/Sprint";
import {SprintWithIssues} from "../../domain/entities/SprintWithIssues";
import IssueModel from "../models/issue.model";
import SprintModel, {SprintCreationAttributes} from "../models/sprint.model";

export interface ISprintRepository {
  createSprint(sprint: SprintCreationAttributes): Promise<Sprint>;
  getCurrentSprintIssues(projectId: string): Promise<SprintWithIssues>;
}

export class SprintRepository implements ISprintRepository {
  public async createSprint(sprint: SprintCreationAttributes): Promise<Sprint> {
    const sprintModel = await SprintModel.create(sprint);

    return new Sprint(sprintModel);
  }

  public async getCurrentSprintIssues(projectId: string): Promise<SprintWithIssues> {
    const sprintWithIssues = await SprintModel.findOne({
      where: {
        [Op.and]: {
          projectId,
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
    });

    if (!sprintWithIssues) {
      throw new Error("Sprint not found");
    }

    return new SprintWithIssues(sprintWithIssues);
  }
}