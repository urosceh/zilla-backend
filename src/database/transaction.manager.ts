import {QueryTypes, Transaction} from "sequelize";
import sequelize from "./sequelize";

export class TransactionManager {
  /**
   * Create a transaction with tenant schema context
   * This sets the search_path for the entire transaction
   */
  public static async createTenantTransaction(schemaName: string): Promise<Transaction> {
    const transaction = await sequelize.transaction();

    try {
      // Set the search path for this transaction to the tenant's schema
      await sequelize.query(`SET LOCAL search_path TO "${schemaName}"`, {
        transaction,
      });

      console.log(`Transaction created with schema: ${schemaName}`);
      return transaction;
    } catch (error) {
      // If setting schema fails, rollback the transaction
      await transaction.rollback();
      console.error(`Failed to set schema ${schemaName} for transaction:`, error);
      throw error;
    }
  }

  /**
   * Execute a function within a tenant transaction context
   * Automatically handles transaction creation, schema setting, and cleanup
   */
  public static async executeInTenantTransaction<T>(schemaName: string, operation: (transaction: Transaction) => Promise<T>): Promise<T> {
    const transaction = await this.createTenantTransaction(schemaName);

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
