import {Op} from "sequelize";
import {Project} from "../../domain/entities/Project";
import {UserProjectAccess} from "../../domain/entities/UserProjectAccess";
import {BadGateway, NotFound} from "../../domain/errors/errors.index";
import ProjectModel from "../models/project.model";
import UserProjectAccessModel from "../models/user.project.access.model";

export interface IUserProjectAccessRepository {
  getUserProjectAccess(userId: string, projectKey: string): Promise<UserProjectAccess>;
  insertAccess(userIds: string[], projectKey: string): Promise<void>;
  deleteAccess(userIds: string[], projectKey: string): Promise<void>;
  hasAccess(userId: string, projectKey: string): Promise<boolean>;
  getAllUsersProjects(userId: string, options: {limit: number; offset: number; search?: string}): Promise<Project[]>;
}

export class UserProjectAccessRepository implements IUserProjectAccessRepository {
  public async getUserProjectAccess(userId: string, projectKey: string): Promise<UserProjectAccess> {
    const userProjectAccess = await UserProjectAccessModel.findOne({
      where: {
        userId,
        projectKey,
      },
      include: [
        {
          model: ProjectModel,
          as: "project",
        },
      ],
    });

    if (!userProjectAccess) {
      throw new NotFound("User Project Access Not Found", {method: this.getAllUsersProjects.name, userId, projectKey});
    }
    if (!userProjectAccess.project) {
      throw new BadGateway("Project of UserProjectAccess Not Found", {
        userProjectAccess: userProjectAccess.toJSON(),
        method: this.getAllUsersProjects.name,
        userId,
        projectKey,
      });
    }

    return new UserProjectAccess(userProjectAccess);
  }

  public async insertAccess(userIds: string[], projectKey: string): Promise<void> {
    const acessess = userIds.map((userId) => ({
      userId,
      projectKey,
    }));

    await UserProjectAccessModel.bulkCreate(acessess, {ignoreDuplicates: true});

    return;
  }

  public async deleteAccess(userIds: string[], projectKey: string): Promise<void> {
    await UserProjectAccessModel.destroy({
      where: {
        [Op.and]: {
          userId: {
            [Op.in]: userIds,
          },
          projectKey,
        },
      },
    });

    return;
  }

  public async hasAccess(userId: string, projectKey: string): Promise<boolean> {
    const access = await UserProjectAccessModel.findOne({
      where: {
        userId,
        projectKey,
      },
    });

    return !!access;
  }

  public async getAllUsersProjects(userId: string, options: {limit: number; offset: number; search?: string}): Promise<Project[]> {
    const whereCondition = options.search
      ? {
          [Op.or]: {
            projectKey: {
              [Op.iLike]: `%${options.search}%`,
            },
            projectName: {
              [Op.iLike]: `%${options.search}%`,
            },
          },
        }
      : {};

    const userProjectAccesses = await UserProjectAccessModel.findAll({
      where: {
        userId,
      },
      limit: options.limit,
      offset: options.offset,
      include: [
        {
          model: ProjectModel,
          as: "project",
          where: whereCondition,
        },
      ],
    });

    return userProjectAccesses.map((upa) => new Project(upa.project!));
  }
}
