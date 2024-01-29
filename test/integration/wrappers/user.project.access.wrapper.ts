import {AbstractWrapper} from "./abstract/abstract.wrapper";

export class UserProjectAccessWrapper extends AbstractWrapper {
  protected tableName = "user_project_access";
  protected associatedTableNames = ["project", "zilla_user"];

  public async getByProjectKey(projectKey: string): Promise<any[]> {
    const result = await this.rawSelect("SELECT * FROM user_project_access WHERE project_key = :projectKey", {replacements: {projectKey}});

    return result;
  }

  public async getByUserId(userId: string): Promise<any[]> {
    const result = await this.rawSelect("SELECT * FROM user_project_access WHERE user_id = :userId", {replacements: {userId}});

    return result;
  }
}
