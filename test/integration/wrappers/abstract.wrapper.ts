import {QueryOptions, QueryTypes, Sequelize} from "sequelize";
import sequelize from "../../../src/database/sequelize";

export abstract class AbstractWrapper {
  protected abstract tableName: string;
  private _sequelize: Sequelize = sequelize;

  public async cleanup() {
    await this._sequelize.query(`DELETE FROM ${this.tableName} WHERE TRUE`);
  }

  protected async rawSelect(query: string, options?: QueryOptions) {
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
