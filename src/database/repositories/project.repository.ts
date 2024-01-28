import {Project} from "../../domain/entities/Project";
import {ProjectWithManager} from "../../domain/entities/ProjectWithManager";
import {IUser} from "../../domain/interfaces/IUser";
import ProjectModel from "../models/project.model";
import UserModel from "../models/user.model";

export interface IProjectRepository {
  createProject(project: Project): Promise<any>;
}

export class ProjectRepository implements IProjectRepository {
  public async createProject(project: Project): Promise<ProjectWithManager> {
    const transaction = await ProjectModel.sequelize!.transaction();

    try {
      const newProject: any = await ProjectModel.create(project.getForCreate(), {
        transaction,
      });

      const manager: IUser | null = await UserModel.findOne({
        where: {
          userId: newProject.managerId,
        },
        transaction,
      });

      if (!manager) {
        throw new Error("Manager not found");
      }

      await transaction.commit();
      return new ProjectWithManager(newProject, manager);
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }
}
