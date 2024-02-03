import {Project} from "../../domain/entities/Project";
import {ProjectWithManager} from "../../domain/entities/ProjectWithManager";
import {NotFound} from "../../domain/errors/errors.index";
import ProjectModel, {ProjectCreationAttributes} from "../models/project.model";
import UserModel from "../models/user.model";
import UserProjectAccessModel from "../models/user.project.access.model";

export interface IProjectRepository {
  getProjectById(projectId: string): Promise<ProjectWithManager>;
  getProjectByProjectKey(projectKey: string, options?: {withManager: boolean}): Promise<ProjectWithManager>;
  createProject(project: ProjectCreationAttributes): Promise<Project>;
  getAllProjects(options: {limit: number; offset: number}): Promise<ProjectWithManager[]>;
}

export class ProjectRepository implements IProjectRepository {
  public async getProjectById(projectId: string): Promise<ProjectWithManager> {
    const project = await ProjectModel.findOne({
      where: {
        projectId,
      },
      include: [
        {
          model: UserModel,
          as: "manager",
        },
      ],
    });

    if (!project) {
      throw new NotFound("Project Not Found", {method: this.getProjectById.name, projectId});
    }

    return new ProjectWithManager(project);
  }

  public async getProjectByProjectKey(projectKey: string, options?: {withManager: boolean}): Promise<ProjectWithManager> {
    const include = options?.withManager
      ? [
          {
            model: UserModel,
            as: "manager",
          },
        ]
      : [];

    const project = await ProjectModel.findOne({
      where: {
        projectKey,
      },
      include,
    });

    if (!project) {
      throw new NotFound("Project Not Found", {method: this.getProjectByProjectKey.name, projectKey});
    }

    return new ProjectWithManager(project);
  }

  public async createProject(project: ProjectCreationAttributes): Promise<Project> {
    const transaction = await ProjectModel.sequelize!.transaction();

    try {
      const newProject = await ProjectModel.create(project, {
        transaction,
      });

      await UserProjectAccessModel.create(
        {
          userId: project.managerId,
          projectKey: newProject.projectKey,
        },
        {transaction}
      );

      await transaction.commit();
      return new Project(newProject);
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  public async getAllProjects(options: {limit: number; offset: number}): Promise<ProjectWithManager[]> {
    const projects = await ProjectModel.findAll({
      limit: options.limit,
      offset: options.offset,
      include: [
        {
          model: UserModel,
          as: "manager",
        },
      ],
      order: [["updatedAt", "DESC"]],
    });

    return projects.map((project) => new ProjectWithManager(project));
  }
}
