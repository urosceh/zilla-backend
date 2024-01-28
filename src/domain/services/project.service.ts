import {IProjectRepository} from "../../database/repositories/project.repository";
import {Project} from "../entities/Project";
import {ProjectWithManager} from "../entities/ProjectWithManager";

export class ProjectService {
  constructor(private _projectRepository: IProjectRepository) {}

  async createProject(project: Project): Promise<ProjectWithManager> {
    return this._projectRepository.createProject(project);
  }
}
