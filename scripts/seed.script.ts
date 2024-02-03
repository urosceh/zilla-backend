import axios from "axios";
import {DatabaseConfig} from "../src/config/db.config";
import ProjectModel from "../src/database/models/project.model";
import SprintModel from "../src/database/models/sprint.model";
import UserProjectAccessModel from "../src/database/models/user.project.access.model";
import {Project} from "../src/domain/entities/Project";
import {seedProjects} from "./data/projects";
import {seedSprints} from "./data/sprints";

process.env.NODE_ENV = "test";

const adminEmail: string = process.env.ADMIN_EMAL || "";
const adminPassword: string = process.env.ADMIN_PASSWORD || "";

if (!adminEmail || !adminPassword) {
  console.error("ADMIN_EMAL and ADMIN_PASSWORD not found in .env");
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
    this.seed()
      .then(() => {
        console.log("Seeding complete");
      })
      .catch((error) => {
        console.error("Seeding failed");
        console.error(error);
      });
  }

  public async seed() {
    await this.login();

    const userIds = await this.createUsersBatch();

    const projects = await this.createProjects(userIds);

    await this.createSprints(projects);

    await this.createIssues(userIds, projects);
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

    console.log(DatabaseConfig.port);

    const createdProjects = await ProjectModel.bulkCreate(projects);

    await UserProjectAccessModel.bulkCreate(projects.map((project) => ({projectKey: project.projectKey, userId: project.managerId})));

    return createdProjects.map((project) => new Project(project));
  }

  private async createSprints(projects: Project[]): Promise<void> {
    const sprints = seedSprints(projects);

    const createdSprints = await SprintModel.bulkCreate(sprints);
  }

  private async createIssues(userIds: string[], projects: Project[]): Promise<void> {}

  private async createUserProjectAccess(data: {projectKey: string; userId: string}[]): Promise<void> {
    await UserProjectAccessModel.bulkCreate(data);
  }
}

new Seed();
