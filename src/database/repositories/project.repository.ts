import {ProjectWithManager} from "../../domain/entities/ProjectWithManager";
import ProjectModel, {ProjectCreationAttributes} from "../models/project.model";
import UserModel from "../models/user.model";

export interface IProjectRepository {
  createProject(project: ProjectCreationAttributes): Promise<ProjectWithManager>;
}

export class ProjectRepository implements IProjectRepository {
  public async createProject(project: ProjectCreationAttributes): Promise<ProjectWithManager> {
    const transaction = await ProjectModel.sequelize!.transaction();

    try {
      const newProject: any = await ProjectModel.create(project, {
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
}
