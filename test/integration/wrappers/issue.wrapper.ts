import ProjectModel from "../../../src/database/models/project.model";
import SprintModel from "../../../src/database/models/sprint.model";
import UserModel from "../../../src/database/models/user.model";
import {AbstractWrapper} from "./abstract/abstract.wrapper";

export class IssueWrapper extends AbstractWrapper {
  protected tableName = "issue";
  protected primaryKey = "issue_id";

  public testUserModels: UserModel[] = [];
  public testProjectModels: ProjectModel[] = [];
  public testSprintModels: SprintModel[] = [];

  public async setup(): Promise<void> {
    const users = await UserModel.findAll();
    const projects = await ProjectModel.findAll();
    const sprints = await SprintModel.findAll();

    this.testUserModels = users;
    this.testProjectModels = projects;
    this.testSprintModels = sprints;
  }
}
