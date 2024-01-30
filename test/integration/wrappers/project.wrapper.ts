import UserModel from "../../../src/database/models/user.model";
import {AbstractWrapper} from "./abstract/abstract.wrapper";

export class ProjectWrapper extends AbstractWrapper {
  protected tableName = "project";
  protected primaryKey = "project_id";

  public testUserModels: UserModel[] = [];

  public async setup(): Promise<void> {
    const users = await UserModel.findAll();

    this.testUserModels = users;
  }

  public async getProject(projectId: string): Promise<any> {
    const result = await this.rawSelect("SELECT * FROM project WHERE project_id = :projectId", {replacements: {projectId}});

    return result.length === 0 ? null : result[0];
  }
}
