import {AbstractWrapper} from "./abstract/abstract.wrapper";

export class UserWrapper extends AbstractWrapper {
  protected tableName = "zilla_user";
  protected associatedTableNames = [];

  public async getUser(userId: string): Promise<any> {
    const result = await this.rawSelect("SELECT * FROM zilla_user WHERE user_id = :userId", {replacements: {userId}});

    return result.length === 0 ? null : result[0];
  }

  public async getUsers(userIds: string[]): Promise<any> {
    const result = await this.rawSelect("SELECT * FROM zilla_user WHERE user_id IN (:userIds)", {replacements: {userIds}});

    return result;
  }
}
