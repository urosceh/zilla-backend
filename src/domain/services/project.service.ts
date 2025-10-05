import {CreateProjectRequest} from "../../api/project/create.project/create.project.request";
import {GetAllProjectsRequest} from "../../api/project/get.all.projects/get.all.projects.request";
import {GetProjectRequest} from "../../api/project/get.project/get.project.request";
import {IProjectRepository} from "../../database/repositories/project.repository";
import {TransactionManager} from "../../database/transaction.manager";
import {Project} from "../entities/Project";
import {ProjectWithManager} from "../entities/ProjectWithManager";

export class ProjectService {
  constructor(private _projectRepository: IProjectRepository) {}

  public async getProjectByProjectKey(request: GetProjectRequest): Promise<ProjectWithManager> {
    const transaction = await TransactionManager.createTenantTransaction(request.tenantId);

    try {
      const project = await this._projectRepository.getProjectByProjectKey(request.projectKey, {withManager: true}, transaction);
      await transaction.commit();
      return project;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  public async getAllProjects(request: GetAllProjectsRequest): Promise<ProjectWithManager[]> {
    const transaction = await TransactionManager.createTenantTransaction(request.tenantId);

    try {
      const projects = await this._projectRepository.getAllProjects(request.options, transaction);
      await transaction.commit();
      return projects;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  public async createProject(request: CreateProjectRequest): Promise<Project> {
    const transaction = await TransactionManager.createTenantTransaction(request.tenantId);

    try {
      const project = {
        projectName: request.projectName,
        projectKey: request.projectKey,
        managerId: request.managerId,
      };

      const newProject = await this._projectRepository.createProject(project, transaction);
      await transaction.commit();
      return newProject;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }
}
