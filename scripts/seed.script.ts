import axios from "axios";
import IssueModel from "../src/database/models/issue.model";
import ProjectModel from "../src/database/models/project.model";
import SprintModel from "../src/database/models/sprint.model";
import UserProjectAccessModel from "../src/database/models/user.project.access.model";
import {Project} from "../src/domain/entities/Project";
import {seedProjects} from "./data/projects";
import {seedSprints} from "./data/sprints";

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
    await this.login();

    const userIds = await this.createUsersBatch();

    const projects = await this.createProjects(userIds);

    await this.createSprints(projects);

    const issueData: {projectId: string; reporterId: string; summary: string}[] = projects.flatMap((project) => {
      let i = 1;
      return Array.from({length: Math.floor(Math.random() * 11) + 15}, () => {
        const projectId = project.projectId;
        const reporterId = userIds[Math.floor(Math.random() * userIds.length)];
        const summary = `${project.projectKey}: issue ${i++}`;

        return {projectId, reporterId, summary};
      });
    });

    await this.createUserProjectAccess(
      projects.map((project) => project.projectKey),
      userIds,
      issueData.map((data) => ({projectKey: projects.find((p) => p.projectId === data.projectId)?.projectKey!, userId: data.reporterId}))
    );

    await this.createIssues(issueData);
  }

  private async login() {
    const result = await this._axios.post("/user/login", {email: adminEmail, password: adminPassword});

    this._axios.defaults.headers.common["Authorization"] = result.data.bearerToken;
  }

  private async createUsersBatch(): Promise<string[]> {
    const emails = [
      "john.doe@gmail.com",
      "alice.smith@hotmail.com",
      "bob.johnson@gmail.com",
      "eva.anderson@hotmail.com",
      "chris.taylor@gmail.com",
      "sophia.brown@outlook.com",
      "leo.miller@gmail.com",
      "emma.clark@hotmail.com",
      "daniel.jones@gmail.com",
      "olivia.moore@outlook.com",
      "liam.white@gmail.com",
      "ava.harris@hotmail.com",
      "mia.lee@gmail.com",
      "noah.johnson@outlook.com",
      "isabella.turner@gmail.com",
      "lucas.davis@hotmail.com",
      "mia.jackson@gmail.com",
      "ethan.smith@outlook.com",
      "amelia.martin@gmail.com",
      "william.jones@hotmail.com",
    ];
    const users = await this._axios.post("/user/create-batch", {emails});

    console.log("Users created, check ./scripts/passwords.txt for passwords");

    const userIds: string[] = users.data.map((user: any) => user.userId);

    return userIds;
  }

  private async createProjects(userIds: string[]): Promise<Project[]> {
    const projects = seedProjects(userIds);

    const createdProjects = await ProjectModel.bulkCreate(projects);

    return createdProjects.map((project) => new Project(project));
  }

  private async createSprints(projects: Project[]): Promise<void> {
    const sprints = seedSprints(projects);

    const createdSprints = await SprintModel.bulkCreate(sprints);
  }

  private async createIssues(data: {projectId: string; reporterId: string; summary: string}[]): Promise<void> {
    await IssueModel.bulkCreate(data, {ignoreDuplicates: true});
  }

  private async createUserProjectAccess(
    projectKeys: string[],
    userIds: string[],
    issueData: {projectKey: string; userId: string}[]
  ): Promise<void> {
    const data: {projectKey: string; userId: string}[] = projectKeys.flatMap((projectKey) =>
      Array.from({length: Math.floor(Math.random() * 6) + 5}, () => {
        const userId = userIds[Math.floor(Math.random() * userIds.length)];
        return {projectKey, userId};
      })
    );

    await UserProjectAccessModel.bulkCreate(data, {ignoreDuplicates: true});
  }
}

new Seed();
