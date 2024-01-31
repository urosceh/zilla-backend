import {QueryOptions, QueryTypes, Sequelize} from "sequelize";
import sequelize from "../../../../src/database/sequelize";

export abstract class AbstractWrapper {
  protected abstract tableName: string;
  protected abstract primaryKey: string;
  private _sequelize: Sequelize = sequelize;

  public async cleanup(ids: string[] | number[]) {
    const formattedIds = ids.map((id: string | number) => (typeof id === "string" ? `'${id}'` : id.toString()));

    const inStatement = formattedIds.length > 0 ? `${this.primaryKey} IN (${formattedIds.join(", ")})` : "false";

    await this._sequelize.query(`DELETE FROM ${this.tableName} WHERE ${inStatement}`, {logging: false});
  }

  protected async rawSelect(query: string, options?: QueryOptions): Promise<any[]> {
    return await this._sequelize.query(query, {...options, type: QueryTypes.SELECT});
  }

  protected async rawInsert(query: string, options?: QueryOptions) {
    return await this._sequelize.query(query, {...options, type: QueryTypes.INSERT});
  }

  protected async rawUpdate(query: string, options?: QueryOptions) {
    return await this._sequelize.query(query, {...options, type: QueryTypes.UPDATE});
  }

  protected async rawDelete(query: string, options?: QueryOptions) {
    return await this._sequelize.query(query, {...options, type: QueryTypes.DELETE});
  }
}
