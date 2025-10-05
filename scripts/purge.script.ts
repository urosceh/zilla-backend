import {truncateSync} from "fs";
import {Transaction} from "sequelize";
import {TenantService} from "../src/config/tenant.config";
import sequelize from "../src/database/sequelize";
import {TransactionManager} from "../src/database/transaction.manager";

const adminEmail: string = process.env.ADMIN_EMAL || "";
const tenant: string = process.env.TENANT || "";

if (!adminEmail) {
  console.error("ADMIN_EMAL not found in .env");
  process.exit(1);
}
if (process.env.NODE_ENV !== "test") {
  console.error("NODE_ENV must equal 'test'. Add it to .env file.");
  process.exit(1);
}

if (!tenant) {
  console.error("TENANT not found in .env");
  process.exit(1);
}

export class Purge {
  constructor() {
    console.log("Purging database. Date", new Date().toString());
    this.purge()
      .then(() => {
        console.log("Purge completed");
        process.exit(0);
      })
      .catch((error) => {
        console.error("Purge failed");
        console.error(error);
        process.exit(1);
      });
  }

  public async purge() {
    const schemaName = TenantService.getTenantById(tenant).schemaName;

    const transaction = await TransactionManager.createTenantTransaction(schemaName);

    try {
      await this.deleteIssues(transaction);
      await this.deleteSprints(transaction);
      await this.deleteUserProjectAccess(transaction);
      await this.deleteProjects(transaction);
      await this.deleteUsers(transaction);

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }

    try {
      truncateSync("./passwords.txt");
    } catch (error: any) {
      if (error.code === "ENOENT") {
        console.log("Passwords file not found");
      } else {
        throw error;
      }
    }
    console.log("Passwords file truncated");
  }

  private async deleteIssues(transaction: Transaction) {
    await sequelize.query("DELETE FROM issue WHERE true", {transaction});
  }

  private async deleteSprints(transaction: Transaction) {
    await sequelize.query("DELETE FROM sprint WHERE true", {transaction});
    await sequelize.query("ALTER SEQUENCE sprint_sprint_id_seq RESTART WITH 1", {transaction});
  }

  private async deleteUserProjectAccess(transaction: Transaction) {
    await sequelize.query("DELETE FROM user_project_access WHERE true", {transaction});
    await sequelize.query("ALTER SEQUENCE user_project_access_id_seq RESTART WITH 1", {transaction});
  }

  private async deleteProjects(transaction: Transaction) {
    await sequelize.query("DELETE FROM project WHERE true", {transaction});
    await sequelize.query("ALTER SEQUENCE project_project_id_seq RESTART WITH 1", {transaction});
  }

  private async deleteUsers(transaction: Transaction) {
    await sequelize.query(`DELETE FROM admin_user WHERE user_id != (SELECT user_id FROM zilla_user WHERE email = '${adminEmail}')`, {
      transaction,
    });
    await sequelize.query(`DELETE FROM zilla_user WHERE email != '${adminEmail}'`, {transaction});
  }
}

new Purge();
