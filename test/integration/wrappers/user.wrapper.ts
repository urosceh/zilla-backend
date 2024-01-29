import {AbstractWrapper} from "./abstract.wrapper";

export class UserWrapper extends AbstractWrapper {
  protected tableName: string = "zilla_user";

  public async getUser(userId: string): Promise<any> {
    const result = await this.rawSelect("SELECT * FROM zilla_user WHERE user_id = :userId", {replacements: {userId}});

    if (result.length === 0) {
      throw new Error(`User with id ${userId} not found`);
    }
    return result[0];
  }

  public async getUsers(userIds: string[]): Promise<any> {
    const result = await this.rawSelect("SELECT * FROM zilla_user WHERE user_id IN (:userIds)", {replacements: {userIds}});

    return result;
  }
}
