import IssueModel from "../src/database/models/issue.model";
import ProjectModel from "../src/database/models/project.model";
import SprintModel from "../src/database/models/sprint.model";
import UserModel from "../src/database/models/user.model";
import UserProjectAccessModel from "../src/database/models/user.project.access.model";

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

    const userProjectAccesses = await UserProjectAccessModel.bulkCreate([
      {
        userId: testUsers[0].userId,
        projectKey: testProjects[0].projectKey,
      },
    ]);

    const sprint = await SprintModel.bulkCreate([
      {
        projectId: testProjects[0].projectId,
        sprintName: "Sprint 1",
        startOfSprint: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7), // - 7 days
        endOfSprint: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7), // + 7 days
      },
    ]);

    const issues = await IssueModel.bulkCreate([
      {
        projectId: testProjects[0].projectId,
        summary: "PJC1 Issue 1",
        reporterId: testUsers[0].userId,
        sprintId: sprint[0].sprintId,
      },
      {
        projectId: testProjects[0].projectId,
        summary: "PJC1 Issue 2",
        reporterId: testUsers[0].userId,
        assigneeId: testUsers[1].userId,
      },
      {
        projectId: testProjects[0].projectId,
        summary: "PJC1 Issue 3",
        reporterId: testUsers[0].userId,
        sprintId: sprint[0].sprintId,
      },
      {
        projectId: testProjects[1].projectId,
        summary: "PJC2 Issue 1",
        reporterId: testUsers[0].userId,
      },
      {
        projectId: testProjects[1].projectId,
        summary: "PJC2 Issue 2",
        reporterId: testUsers[1].userId,
      },
    ]);
  }
}
