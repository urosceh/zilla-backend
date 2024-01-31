import assert from "assert";
import test, {after, before, describe} from "node:test";
import {ProjectRepository} from "../../../src/database/repositories/project.repository";
import {User} from "../../../src/domain/entities/User";
import {ProjectWrapper} from "../wrappers/project.wrapper";

describe("ProjectModel Integration Tests", () => {
  const projectRepository = new ProjectRepository();
  const projectWrapper = new ProjectWrapper();

  const projectIds: string[] = [];

  before(async () => {
    await projectWrapper.setup();
  });

  after(async () => {
    await projectWrapper.cleanup(projectIds);
  });

  test("should create a project", async () => {
    const user = projectWrapper.testUserModels.find((user) => user.email === "john.doe@gmail.com")!;

    const createdProject = await projectRepository.createProject({
      projectName: "Test Repo Project",
      projectKey: "TRP",
      managerId: user.userId,
    });

    assert.ok(!!createdProject);
    assert.ok(!!createdProject.projectId);
    assert.ok(!!createdProject.createdAt);
    assert.equal(createdProject.projectName, "Test Repo Project");
    assert.equal(createdProject.projectKey, "TRP");
    assert.ok(createdProject.manager instanceof User);
    assert.equal(createdProject.manager.userId, user.userId);
    assert.equal(createdProject.manager.email, user.email);

    projectIds.push(createdProject.projectId);
  });

  test("should get all projects", async () => {
    const projects = await projectRepository.getAllProjects({
      limit: 10,
      offset: 0,
    });

    assert.ok(projects.find((project) => project.projectKey === "PJC1"));
    assert.ok(projects.find((project) => project.projectKey === "PJC2"));
  });
});
