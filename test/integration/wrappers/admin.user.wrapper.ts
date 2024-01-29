import {AbstractWrapper} from "./abstract/abstract.wrapper";

export class AdminUserWrapper extends AbstractWrapper {
  protected tableName = "admin_user";
  protected associatedTableNames = ["zilla_user"];

  public async getAdminUser(adminUserId: string): Promise<any> {
    const result = await this.rawSelect("SELECT * FROM admin_user WHERE user_id = :adminUserId", {replacements: {adminUserId}});

    return result.length === 0 ? null : result[0];
  }

  public async doesNotExist(adminUserId: string): Promise<boolean> {
    const result = await this.rawSelect("SELECT * FROM admin_user WHERE user_id = :adminUserId", {replacements: {adminUserId}});

    return result.length === 0;
  }
}
