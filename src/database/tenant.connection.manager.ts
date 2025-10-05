import {Sequelize, Transaction} from "sequelize";
import {DatabaseConfig} from "../config/db.config";
import {TenantService} from "../config/tenant.config";

export class TenantConnectionManager {
  private static connections: Map<string, Sequelize> = new Map();

  public static getTenantConnection(tenantId: string): Sequelize {
    if (!this.connections.has(tenantId)) {
      const credentials = TenantService.getTenantDatabaseCredentials(tenantId);

      const sequelizeInstance = new Sequelize(DatabaseConfig.database, credentials.username, credentials.password, {
        host: DatabaseConfig.host,
        port: DatabaseConfig.port,
        dialect: "postgres",
        logging: false,
      });

      this.connections.set(tenantId, sequelizeInstance);
    }

    return this.connections.get(tenantId)!;
  }

  public static async createTenantTransaction(tenantId: string): Promise<Transaction> {
    const connection = this.getTenantConnection(tenantId);
    const tenant = TenantService.getTenantById(tenantId);

    const transaction = await connection.transaction();

    // Set the search path for this transaction
    await connection.query(`SET LOCAL search_path TO "${tenant.schemaName}"`, {transaction});

    console.log(`Transaction created for tenant: ${tenantId} with schema: ${tenant.schemaName}`);

    return transaction;
  }

  public static async closeAllConnections(): Promise<void> {
    const closePromises = Array.from(this.connections.values()).map((connection) => connection.close());

    await Promise.all(closePromises);
    this.connections.clear();
  }

  public static getConnectionCount(): number {
    return this.connections.size;
  }
}
