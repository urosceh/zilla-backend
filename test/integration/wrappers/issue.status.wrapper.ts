import {AbstractWrapper} from "./abstract/abstract.wrapper";

export class IssueStatusWrapper extends AbstractWrapper {
  protected tableName = "issue_status";
  protected associatedTableNames = [];

  public async getAll(): Promise<any[]> {
    const result = await this.rawSelect("SELECT * FROM issue_status");

    return result;
  }
}
