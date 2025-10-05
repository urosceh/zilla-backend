import {QueryTypes, Transaction} from "sequelize";
import sequelize from "./sequelize";
import {TenantConnectionManager} from "./tenant.connection.manager";

export class TransactionManager {
  /**
   * Create a transaction with tenant schema context
   * This uses tenant-specific database credentials when available
   */
  public static async createTenantTransaction(tenantId: string): Promise<Transaction> {
    return await TenantConnectionManager.createTenantTransaction(tenantId);
  }

  /**
   * Execute a function within a tenant transaction context
   * Automatically handles transaction creation, schema setting, and cleanup
   */
  public static async executeInTenantTransaction<T>(tenant: string, operation: (transaction: Transaction) => Promise<T>): Promise<T> {
    const transaction = await this.createTenantTransaction(tenant);

    try {
      const result = await operation(transaction);
      await transaction.commit();
      return result;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  /**
   * Verify that a schema exists before creating a transaction
   */
  public static async verifySchemaExists(schemaName: string): Promise<boolean> {
    try {
      const result = await sequelize.query(`SELECT EXISTS(SELECT 1 FROM information_schema.schemata WHERE schema_name = :schemaName)`, {
        replacements: {schemaName},
        type: QueryTypes.SELECT,
      });

      return (result[0] as any).exists;
    } catch (error) {
      console.error(`Error checking schema existence for ${schemaName}:`, error);
      return false;
    }
  }
}
