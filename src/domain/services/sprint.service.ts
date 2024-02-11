import {ISprintRepository} from "../../database/repositories/sprint.repository";
import {Sprint} from "../entities/Sprint";
import {ISprint} from "../interfaces/ISprint";

export class SprintService {
  constructor(private _sprintRepository: ISprintRepository) {}

  public async createSprint(sprint: ISprint): Promise<Sprint> {
    const {projectKey, sprintName, startOfSprint, endOfSprint} = sprint;

    return this._sprintRepository.createSprint({projectKey, sprintName, startOfSprint, endOfSprint});
  }

  public async getCurrentSprintIssues(projectId: string): Promise<Sprint> {
    return this._sprintRepository.getCurrentSprintIssues(projectId);
  }

  public async getProjectSprints(projectKey: string): Promise<Sprint[]> {
    return this._sprintRepository.getProjectSprints(projectKey);
  }
}
