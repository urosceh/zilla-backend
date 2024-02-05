import {ISprintRepository} from "../../database/repositories/sprint.repository";
import {Sprint} from "../entities/Sprint";

export class SprintService {
  constructor(private _sprintRepository: ISprintRepository) {}

  public async createSprint(sprint: {projectKey: string; sprintName: string; startOfSprint: Date; endOfSprint: Date}): Promise<Sprint> {
    const {projectKey, sprintName, startOfSprint, endOfSprint} = sprint;

    return this._sprintRepository.createSprint({projectKey, sprintName, startOfSprint, endOfSprint});
  }

  public async getCurrentSprintIssues(projectId: string): Promise<Sprint> {
    return this._sprintRepository.getCurrentSprintIssues(projectId);
  }
}
