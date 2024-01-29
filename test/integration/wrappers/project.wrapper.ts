import {AbstractWrapper} from "./abstract/abstract.wrapper";

export class ProjectWrapper extends AbstractWrapper {
  protected tableName = "project";
  protected associatedTableNames = ["zilla_user"];

  public async getProject(projectId: string): Promise<any> {
    const result = await this.rawSelect("SELECT * FROM project WHERE project_id = :projectId", {replacements: {projectId}});

    return result.length === 0 ? null : result[0];
  }
}
