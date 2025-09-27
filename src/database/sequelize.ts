import {Sequelize} from "sequelize";
import {DatabaseConfig} from "../config/db.config";

const sequelize = new Sequelize(DatabaseConfig.database, DatabaseConfig.username, DatabaseConfig.password, {
  host: DatabaseConfig.host,
  port: DatabaseConfig.port,
  dialect: "postgres",
  schema: DatabaseConfig.schema,
});

export default sequelize;
