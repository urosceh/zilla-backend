import ProjectModel from "../src/database/models/project.model";
import UserModel from "../src/database/models/user.model";

export class GlobalAfter {
  public static async run() {
    await ProjectModel.destroy({where: {}, truncate: true, cascade: true, force: true});
    await UserModel.destroy({where: {}, truncate: true, cascade: true, force: true});
  }
}
