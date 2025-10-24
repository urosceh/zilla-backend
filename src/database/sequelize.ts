import {Sequelize} from "sequelize";
import {DatabaseConfig} from "../config/db.config";

const sequelize = new Sequelize(DatabaseConfig.database, DatabaseConfig.username, DatabaseConfig.password, {
  host: DatabaseConfig.host,
  port: DatabaseConfig.port,
  dialect: "postgres",
  schema: DatabaseConfig.schema,
  logging: false,
  pool: {
    max: 50,
    min: 0,
    acquire: 30000,
    idle: 10000,
    evict: 3000,
  },
});

export default sequelize;
