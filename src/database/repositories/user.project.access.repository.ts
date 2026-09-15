import {Op, Transaction} from "sequelize";
import {ProjectWithManager} from "../../domain/entities/ProjectWithManager";
import {User} from "../../domain/entities/User";
import {UserProjectAccess} from "../../domain/entities/UserProjectAccess";
import {BadGateway, NotFound} from "../../domain/errors/errors.index";
import {IPaginatable} from "../../domain/interfaces/IPaginatable";
import ProjectModel from "../models/project.model";
import UserModel from "../models/user.model";
import UserProjectAccessModel from "../models/user.project.access.model";

export interface IUserProjectAccessRepository {
  getUserProjectAccess(userId: string, projectKey: string, transaction: Transaction): Promise<UserProjectAccess>;
  insertAccess(userIds: string[], projectKey: string, transaction: Transaction): Promise<void>;
  deleteAccess(userIds: string[], projectKey: string, transaction: Transaction): Promise<void>;
  hasAccess(userId: string, projectKey: string, transaction: Transaction): Promise<boolean>;
  getAllUsersProjects(
    userId: string,
    options: {limit: number; offset: number; search?: string},
    transaction: Transaction
  ): Promise<ProjectWithManager[]>;
  getAllUsersOnProject(projectKey: string, options: IPaginatable, transaction: Transaction): Promise<User[]>;
}

export class UserProjectAccessRepository implements IUserProjectAccessRepository {
  public async getUserProjectAccess(userId: string, projectKey: string, transaction: Transaction): Promise<UserProjectAccess> {
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
      transaction,
    });

    if (!userProjectAccess) {
      throw new NotFound("User Project Access Not Found", {method: this.getUserProjectAccess.name, userId, projectKey});
    }
    if (!userProjectAccess.project) {
      throw new BadGateway("Project of UserProjectAccess Not Found", {
        userProjectAccess: userProjectAccess.toJSON(),
        method: this.getUserProjectAccess.name,
        userId,
        projectKey,
      });
    }

    return new UserProjectAccess(userProjectAccess);
  }

  public async insertAccess(userIds: string[], projectKey: string, transaction: Transaction): Promise<void> {
    const acessess = userIds.map((userId) => ({
      userId,
      projectKey,
    }));

    await UserProjectAccessModel.bulkCreate(acessess, {ignoreDuplicates: true, transaction});

    return;
  }

  public async deleteAccess(userIds: string[], projectKey: string, transaction: Transaction): Promise<void> {
    await UserProjectAccessModel.destroy({
      where: {
        [Op.and]: {
          userId: {
            [Op.in]: userIds,
          },
          projectKey,
        },
      },
      transaction,
    });

    return;
  }

  public async hasAccess(userId: string, projectKey: string, transaction: Transaction): Promise<boolean> {
    const access = await UserProjectAccessModel.findOne({
      where: {
        userId,
        projectKey,
      },
      transaction,
    });

    return !!access;
  }

  public async getAllUsersProjects(
    userId: string,
    options: {limit: number; offset: number; search?: string},
    transaction: Transaction
  ): Promise<ProjectWithManager[]> {
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
          include: [
            {
              model: UserModel,
              as: "manager",
            },
          ],
        },
      ],
      transaction,
    });

    return userProjectAccesses.map((upa) => new ProjectWithManager(upa.project!));
  }

  public async getAllUsersOnProject(projectKey: string, options: IPaginatable, transaction: Transaction): Promise<User[]> {
    const acesses = await UserProjectAccessModel.findAll({
      limit: options.limit,
      offset: options.offset,
      where: {
        projectKey,
      },
      include: [
        {
          model: UserModel,
          as: "user",
        },
      ],
      transaction,
    });

    return acesses.map((access) => new User(access.user!));
  }
}
