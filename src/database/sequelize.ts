import {Sequelize} from "sequelize";
import {DatabaseConfig} from "../config/db.config";

const sequelize = new Sequelize(DatabaseConfig.database, DatabaseConfig.username, DatabaseConfig.password, {
  host: DatabaseConfig.host,
  port: DatabaseConfig.port,
  dialect: "postgres",
  logging: false,
  pool: {
    max: parseInt(process.env.DB_POOL_MAX || "2", 10),
    min: 0,
    acquire: 30000,
    idle: 10000,
    evict: 1000,
  },
});

export default sequelize;
