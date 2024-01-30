import ProjectModel from "../src/database/models/project.model";
import UserModel from "../src/database/models/user.model";

export class GlobalBefore {
  public static async run() {
    const testUsers: UserModel[] = await UserModel.bulkCreate(
      [
        {
          email: "john.doe@gmail.com",
          password: "john123!",
        },
        {
          email: "jane.doe@gmail.com",
          password: "jane123!",
        },
      ],
      {
        logging: false,
      }
    );

    const testProjects = await ProjectModel.bulkCreate(
      [
        {
          projectName: "Project 1",
          projectKey: "PJC1",
          managerId: testUsers[0].userId,
        },
        {
          projectName: "Project 2",
          projectKey: "PJC2",
          managerId: testUsers[0].userId,
        },
      ],
      {
        logging: false,
      }
    );
  }
}
