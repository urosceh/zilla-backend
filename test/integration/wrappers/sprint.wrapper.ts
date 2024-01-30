import ProjectModel from "../../../src/database/models/project.model";
import UserModel from "../../../src/database/models/user.model";
import {AbstractWrapper} from "./abstract/abstract.wrapper";

export class SprintWrapper extends AbstractWrapper {
  protected tableName = "sprint";
  protected primaryKey = "sprint_id";

  public testUserModels: UserModel[] = [];
  public testProjectModels: ProjectModel[] = [];

  public async setup(): Promise<void> {
    const users = await UserModel.findAll();
    const projects = await ProjectModel.findAll();

    this.testUserModels = users;
    this.testProjectModels = projects;
  }
}
