import {ProjectWithManager} from "../../domain/entities/ProjectWithManager";
import ProjectModel, {ProjectCreationAttributes} from "../models/project.model";
import UserModel from "../models/user.model";

export interface IProjectRepository {
  getProjectById(projectId: string): Promise<ProjectWithManager>;
  getProjectByProjectKey(projectKey: string): Promise<ProjectWithManager>;
  isManager(projectKey: string, userId: string): Promise<boolean>;
  createProject(project: ProjectCreationAttributes): Promise<ProjectWithManager>;
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
      throw new Error("Project not found");
    }

    return new ProjectWithManager(project);
  }

  public async getProjectByProjectKey(projectKey: string): Promise<ProjectWithManager> {
    const project = await ProjectModel.findOne({
      where: {
        projectKey,
      },
      include: [
        {
          model: UserModel,
          as: "manager",
        },
      ],
    });

    if (!project) {
      throw new Error("Project not found");
    }

    return new ProjectWithManager(project);
  }

  public async isManager(projectKey: string, userId: string): Promise<boolean> {
    const project = await ProjectModel.findOne({
      where: {
        projectKey,
        managerId: userId,
      },
    });

    return !!project;
  }

  public async createProject(project: ProjectCreationAttributes): Promise<ProjectWithManager> {
    const transaction = await ProjectModel.sequelize!.transaction();

    try {
      const newProject = await ProjectModel.create(project, {
        transaction,
      });

      const projectWithManager = await ProjectModel.findOne({
        where: {
          projectId: newProject.projectId,
        },
        include: [
          {
            model: UserModel,
            as: "manager",
          },
        ],
        transaction,
      });

      if (!projectWithManager) {
        throw new Error("Project not found");
      }

      await transaction.commit();
      return new ProjectWithManager(projectWithManager);
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
