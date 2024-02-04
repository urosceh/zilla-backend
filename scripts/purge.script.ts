import {truncateSync} from "fs";
import sequelize from "../src/database/sequelize";

const adminEmail: string = process.env.ADMIN_EMAL || "";

if (!adminEmail) {
  console.error("ADMIN_EMAL not found in .env");
  process.exit(1);
}
if (process.env.NODE_ENV !== "test") {
  console.error("NODE_ENV must equal 'test'. Add it to .env file.");
  process.exit(1);
}

class Purge {
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
    await this.deleteIssues();
    await this.deleteSprints();
    await this.deleteUserProjectAccess();
    await this.deleteProjects();
    await this.deleteUsers();

    truncateSync("./passwords.txt");
    console.log("Passwords file truncated");
  }

  private async deleteIssues() {
    await sequelize.query("DELETE FROM issue WHERE true");
  }

  private async deleteSprints() {
    await sequelize.query("DELETE FROM sprint WHERE true");
    await sequelize.query("ALTER SEQUENCE sprint_sprint_id_seq RESTART WITH 1");
  }

  private async deleteUserProjectAccess() {
    await sequelize.query("DELETE FROM user_project_access WHERE true");
    await sequelize.query("ALTER SEQUENCE user_project_access_id_seq RESTART WITH 1");
  }

  private async deleteProjects() {
    await sequelize.query("DELETE FROM project WHERE true");
  }

  private async deleteUsers() {
    await sequelize.query(`DELETE FROM zilla_user WHERE email != '${adminEmail}'`);
  }
}

new Purge();
