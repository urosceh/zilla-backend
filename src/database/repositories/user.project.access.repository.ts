import UserProjectAccessModel from "../models/user.project.access.model";

export interface IUserProjectAccessRepository {
  giveAccess(userId: string, projectKey: string): Promise<void>;
  revokeAccess(userId: string, projectKey: string): Promise<void>;
  hasAccess(userId: string, projectKey: string): Promise<boolean>;
}

export class UserProjectAccessRepository implements IUserProjectAccessRepository {
  public async giveAccess(userId: string, projectKey: string): Promise<void> {
    await UserProjectAccessModel.create({
      userId,
      projectKey,
    });

    return;
  }

  public async revokeAccess(userId: string, projectKey: string): Promise<void> {
    await UserProjectAccessModel.destroy({
      where: {
        userId,
        projectKey,
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
