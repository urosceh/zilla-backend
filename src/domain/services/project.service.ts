import {CreateProjectRequest} from "../../api/project/create.project/create.project.request";
import {ProjectCreationAttributes} from "../../database/models/project.model";
import {IProjectRepository} from "../../database/repositories/project.repository";
import {Project} from "../entities/Project";
import {ProjectWithManager} from "../entities/ProjectWithManager";

export class ProjectService {
  constructor(private _projectRepository: IProjectRepository) {}

  public async getProjectByProjectKey(projectKey: string): Promise<ProjectWithManager> {
    return this._projectRepository.getProjectByProjectKey(projectKey);
  }

  public async getProjectById(projectId: string): Promise<ProjectWithManager> {
    return this._projectRepository.getProjectById(projectId);
  }

  public async isManager(projectKey: string, userId: string): Promise<boolean> {
    return this._projectRepository.isManager(projectKey, userId);
  }

  public async createProject(request: CreateProjectRequest): Promise<ProjectWithManager> {
    const project: ProjectCreationAttributes = {
      projectName: request.projectName,
      projectKey: request.projectKey,
      managerId: request.managerId,
    };

    return this._projectRepository.createProject(project);
  }
}
