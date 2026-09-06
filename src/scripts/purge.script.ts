import {truncateSync} from "fs";
import sequelize from "../database/sequelize";

const adminEmail: string = process.env.ADMIN_EMAL || "";

if (!adminEmail) {
  console.error("ADMIN_EMAL is required");
  process.exit(1);
}
if (process.env.NODE_ENV !== "test") {
  console.error("NODE_ENV must equal 'test'");
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
    await this.deleteIssues();
    await this.deleteSprints();
    await this.deleteUserProjectAccess();
    await this.deleteProjects();
    await this.deleteUsers();

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
    await sequelize.query("ALTER SEQUENCE project_project_id_seq RESTART WITH 1");
  }

  private async deleteUsers() {
    await sequelize.query(
      "DELETE FROM admin_user WHERE user_id != (SELECT user_id FROM zilla_user WHERE email = :adminEmail)",
      {replacements: {adminEmail}}
    );
    await sequelize.query("DELETE FROM zilla_user WHERE email != :adminEmail", {replacements: {adminEmail}});
  }
}

new Purge();
