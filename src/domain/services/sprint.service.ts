import {CreateSprintRequest} from "../../api/sprint/create.sprint/create.sprint.request";
import {GetProjectSprintsRequest} from "../../api/sprint/get.project.sprints/get.project.sprints.request";
import {ISprintRepository} from "../../database/repositories/sprint.repository";
import {TransactionManager} from "../../database/transaction.manager";
import {Sprint} from "../entities/Sprint";

export class SprintService {
  constructor(private _sprintRepository: ISprintRepository) {}

  public async createSprint(request: CreateSprintRequest): Promise<Sprint> {
    const transaction = await TransactionManager.createTenantTransaction(request.tenantSchemaName);

    try {
      const sprint = await this._sprintRepository.createSprint(request.sprint, transaction);
      await transaction.commit();
      return sprint;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  public async getProjectSprints(request: GetProjectSprintsRequest): Promise<Sprint[]> {
    const transaction = await TransactionManager.createTenantTransaction(request.tenantSchemaName);

    try {
      const sprints = await this._sprintRepository.getProjectSprints(request.projectKey, transaction);
      await transaction.commit();
      return sprints;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }
}
