import {Op} from "sequelize";
import UserProjectAccessModel from "../models/user.project.access.model";

export interface IUserProjectAccessRepository {
  insertAccess(userIds: string[], projectKey: string): Promise<void>;
  deleteAccess(userIds: string[], projectKey: string): Promise<void>;
  hasAccess(userId: string, projectKey: string): Promise<boolean>;
}

export class UserProjectAccessRepository implements IUserProjectAccessRepository {
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
}
