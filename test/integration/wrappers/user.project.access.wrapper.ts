import ProjectModel from "../../../src/database/models/project.model";
import UserModel from "../../../src/database/models/user.model";
import {AbstractWrapper} from "./abstract/abstract.wrapper";

export class UserProjectAccessWrapper extends AbstractWrapper {
  protected tableName = "user_project_access";
  protected primaryKey = "id";

  public testUserModels: UserModel[] = [];
  public testProjectModels: ProjectModel[] = [];

  public async setup(): Promise<void> {
    const users = await UserModel.findAll();
    const projects = await ProjectModel.findAll();

    this.testUserModels = users;
    this.testProjectModels = projects;
  }

  public async getByProjectKey(projectKey: string): Promise<any[]> {
    const result = await this.rawSelect("SELECT * FROM user_project_access WHERE project_key = :projectKey", {replacements: {projectKey}});

    return result;
  }

  public async getByUserId(userId: string): Promise<any[]> {
    const result = await this.rawSelect("SELECT * FROM user_project_access WHERE user_id = :userId", {replacements: {userId}});

    return result;
  }
}
