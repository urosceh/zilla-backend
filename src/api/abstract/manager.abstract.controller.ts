import {ProjectService} from "../../domain/services/project.service";

export abstract class ManagerAbstractController {
  constructor(private _projectService: ProjectService) {}

  protected async isManager(projectId: string, userId: string): Promise<boolean> {
    return this._projectService.isManager(projectId, userId);
  }
}
