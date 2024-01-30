import {CreateProjectRequest} from "../../api/project/create.project/create.project.request";
import {ProjectCreationAttributes} from "../../database/models/project.model";
import {IProjectRepository} from "../../database/repositories/project.repository";
import {Project} from "../entities/Project";
import {ProjectWithManager} from "../entities/ProjectWithManager";

export class ProjectService {
  constructor(private _projectRepository: IProjectRepository) {}

  async createProject(request: CreateProjectRequest): Promise<ProjectWithManager> {
    const project: ProjectCreationAttributes = {
      projectName: request.projectName,
      projectKey: request.projectKey,
      managerId: request.managerId,
    };
    return this._projectRepository.createProject(project);
  }
}
