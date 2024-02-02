import {ISprintRepository} from "../../database/repositories/sprint.repository";
import {Sprint} from "../entities/Sprint";

export class SprintService {
  constructor(private _sprintRepository: ISprintRepository) {}

  public async createSprint(sprint: {projectId: string; sprintName: string; startOfSprint: Date; endOfSprint: Date}): Promise<Sprint> {
    const {projectId, sprintName, startOfSprint, endOfSprint} = sprint;

    return this._sprintRepository.createSprint({projectId, sprintName, startOfSprint, endOfSprint});
  }

  public async getCurrentSprintIssues(projectId: string): Promise<Sprint> {
    return this._sprintRepository.getCurrentSprintIssues(projectId);
  }
}
