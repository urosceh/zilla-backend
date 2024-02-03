import sequelize from "../src/database/sequelize";

const adminEmail: string = process.env.ADMIN_EMAL || "";

if (!adminEmail) {
  console.error("ADMIN_EMAL not found in .env");
  process.exit(1);
}

class Purge {
  constructor() {
    this.purge()
      .then(() => {
        console.log("Purge complete");
      })
      .catch((error) => {
        console.error("Purge failed");
        console.error(error);
      });
  }

  public async purge() {
    await this.deleteIssues();
    await this.deleteSprints();
    await this.deleteUserProjectAccess();
    await this.deleteProjects();
    await this.deleteUsers();
  }

  private async deleteIssues() {
    await sequelize.query("DELETE FROM issue WHERE true");
  }

  private async deleteSprints() {
    await sequelize.query("DELETE FROM sprint WHERE true");
  }

  private async deleteUserProjectAccess() {
    await sequelize.query("DELETE FROM user_project_access WHERE true");
  }

  private async deleteProjects() {
    await sequelize.query("DELETE FROM project WHERE true");
  }

  private async deleteUsers() {
    await sequelize.query(`DELETE FROM zilla_user WHERE email != '${adminEmail}'`);
  }
}

new Purge();
