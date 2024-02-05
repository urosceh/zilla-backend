import {Op} from "sequelize";
import {Sprint} from "../../domain/entities/Sprint";
import {SprintWithIssues} from "../../domain/entities/SprintWithIssues";
import {NotFound} from "../../domain/errors/errors.index";
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
    });

    if (!sprintWithIssues) {
      throw new NotFound("Sprint with Issues Not Found", {method: this.getCurrentSprintIssues.name, projectId});
    }

    return new SprintWithIssues(sprintWithIssues);
  }
}
