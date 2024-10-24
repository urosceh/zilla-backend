import axios from "axios";
import AdminUserModel from "../src/database/models/admin.user.model";
import IssueModel from "../src/database/models/issue.model";
import ProjectModel from "../src/database/models/project.model";
import SprintModel from "../src/database/models/sprint.model";
import UserModel from "../src/database/models/user.model";
import UserProjectAccessModel from "../src/database/models/user.project.access.model";
import {Project} from "../src/domain/entities/Project";
import {Sprint} from "../src/domain/entities/Sprint";
import {IssueStatus} from "../src/domain/enums/IssueStatus";
import {seedProjects} from "./data/projects";
import {seedSprints} from "./data/sprints";
import {seedUsers} from "./data/users";

const adminEmail: string = process.env.ADMIN_EMAL || "";
const adminPassword: string = process.env.ADMIN_PASSWORD || "";

if (!adminEmail || !adminPassword) {
  console.error("ADMIN_EMAL and ADMIN_PASSWORD not found in .env");
  process.exit(1);
}
if (process.env.NODE_ENV !== "test") {
  console.error("NODE_ENV must equal 'test'. Add it to .env file.");
  process.exit(1);
}

class Seed {
  private _axios = axios.create({
    baseURL: "http://localhost:3000/api",
    headers: {
      "Content-Type": "application/json",
    },
  });

  constructor() {
    console.log("Seeding database. Date", new Date().toString());
    this.seed()
      .then(() => {
        console.log("Seeding complete");
        process.exit(0);
      })
      .catch((error) => {
        console.error("Seeding failed");
        console.error(error);
        process.exit(1);
      });
  }

  public async seed() {
    await this.loginOrCreateAdmin();

    const userIds = await this.createUsersBatch();

    const projects = await this.createProjects(userIds);

    const sprints = await this.createSprints(projects);

    const userAccessData: {projectKey: string; userId: string}[] = projects.flatMap((project) =>
      // 7 to 10 users per project (random user)
      Array.from({length: Math.floor(Math.random() * 4) + 7}, () => {
        const userId = userIds[Math.floor(Math.random() * userIds.length)];
        return {projectKey: project.projectKey, userId};
      })
    );

    await this.createUserProjectAccess(userAccessData);

    await this.createIssues(
      userAccessData,
      projects.map((project) => project.projectKey),
      sprints
    );
  }

  private async loginOrCreateAdmin() {
    try {
      await this.login();
    } catch (error: any) {
      if (error.response.status === 404) {
        await this.createAdmin();
        await this.login();
      } else {
        throw error;
      }
    }
  }

  private async createAdmin() {
    const adminUser = await UserModel.create(
      {
        email: adminEmail,
        password: adminPassword,
        firstName: "Admin",
        lastName: "Admin",
      },
      {
        returning: true,
      }
    );

    await AdminUserModel.create({userId: adminUser.userId});
  }

  private async login() {
    const result = await this._axios.post("/user/login", {email: adminEmail, password: adminPassword});

    this._axios.defaults.headers.common["Authorization"] = result.data.bearerToken;
  }

  private async createUsersBatch(): Promise<string[]> {
    const usersForCreate = seedUsers;
    const users = await this._axios.post("/user/create-batch", {users: usersForCreate});

    console.log("Users created, check ./scripts/passwords.txt for passwords");

    const userIds: string[] = users.data.map((user: any) => user.userId);

    return userIds;
  }

  private async createProjects(userIds: string[]): Promise<Project[]> {
    const projects = seedProjects(userIds);

    const createdProjects = await ProjectModel.bulkCreate(projects);

    return createdProjects.map((project) => new Project(project));
  }

  private async createSprints(projects: Project[]): Promise<Sprint[]> {
    const sprints = seedSprints(projects);

    const createdSprints = await SprintModel.bulkCreate(sprints);

    return createdSprints.map((s) => new Sprint(s));
  }

  private async createIssues(
    userAccessData: {projectKey: string; userId: string}[],
    projectKeys: string[],
    sprints: Sprint[]
  ): Promise<void> {
    // 15 to 25 issues per project (random reporter, assignee (can be undefined), summary, status)
    const data = projectKeys.flatMap((projectKey) => {
      const projectSprintIds: number[] = sprints.filter((s) => s.projectKey === projectKey).map((s) => s.sprintId);
      let i = 1;
      const userIds = userAccessData.filter((access) => access.projectKey === projectKey).map((access) => access.userId);
      return Array.from({length: Math.floor(Math.random() * 11) + 15}, () => {
        const assigneeId = userIds[Math.floor(Math.random() * userIds.length) * 2];
        const reporterId = userIds[Math.floor(Math.random() * userIds.length)];
        const summary = ` Test ${projectKey} issue ${i++}`;
        const issueStatus = assigneeId
          ? Object.values(IssueStatus)[Math.floor(Math.random() * Object.values(IssueStatus).length)]
          : IssueStatus.BACKLOG;
        const sprintId = projectSprintIds[Math.floor(Math.random() * projectSprintIds.length) * 2];

        return {projectKey, reporterId, summary, issueStatus, assigneeId, sprintId};
      });
    });

    const issues = await IssueModel.bulkCreate(data, {ignoreDuplicates: true});
  }

  private async createUserProjectAccess(data: {projectKey: string; userId: string}[]): Promise<void> {
    await UserProjectAccessModel.bulkCreate(data, {ignoreDuplicates: true});
  }
}

new Seed();
