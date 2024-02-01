import {ProjectService} from "../../domain/services/project.service";
import {AbstractController} from "./abstract.controller";

export abstract class ManagerAbstractController extends AbstractController {
  constructor(private _projectService: ProjectService) {
    super();
  }

  protected async isManager(projectKey: string, userId: string): Promise<boolean> {
    return this._projectService.isManager(projectKey, userId);
  }
}
