import {AbstractWrapper} from "./abstract/abstract.wrapper";

export class IssueWrapper extends AbstractWrapper {
  protected tableName = "issue";
  protected associatedTableNames = ["issue_status", "sprint", "project", "zilla_user"];

  public async getIssue(issueId: string): Promise<any> {
    const result = await this.rawSelect("SELECT * FROM issue WHERE issue_id = :issueId", {replacements: {issueId}});

    return result.length === 0 ? null : result[0];
  }
}
