import assert from "node:assert";
import test, {after, before, describe} from "node:test";
import ProjectModel from "../../../src/database/models/project.model";
import UserModel from "../../../src/database/models/user.model";
import {ProjectWrapper} from "../wrappers/project.wrapper";

describe("ProjectModel Integration Tests", () => {
  const projectWrapper = new ProjectWrapper();

  const projectIds: string[] = [];

  before(async () => {
    await projectWrapper.setup();
  });

  after(async () => {
    await projectWrapper.cleanup(projectIds);
  });

  test("should create and delete a project", async () => {
    const user = projectWrapper.testUserModels.find((user) => user.email === "john.doe@gmail.com")!;

    assert.ok(!!user.userId);

    const createdProject = await ProjectModel.create({
      projectName: "Test Project",
      projectKey: "TEST",
      managerId: user.userId,
    });

    const project = await ProjectModel.findOne({
      where: {
        projectId: createdProject.projectId,
      },
      include: [
        {
          model: UserModel,
          as: "manager",
        },
      ],
    });

    assert.ok(!!project);
    assert.ok(!!project.projectId);
    assert.ok(!!project.createdAt);
    assert.equal(project.projectName, "Test Project");
    assert.equal(project.projectKey, "TEST");
    assert.ok(project.manager instanceof UserModel);
    assert.equal(project.manager.email, "john.doe@gmail.com");

    projectIds.push(project.projectId);

    await assert.rejects(async () => {
      await user.destroy({
        force: true,
      });
    });

    const projectId: string = project.projectId;

    await project.destroy();

    const paranoidDeletedProject = await ProjectModel.findOne({
      where: {
        projectId,
      },
      paranoid: false,
    });

    assert.ok(!!paranoidDeletedProject);
    assert.equal(paranoidDeletedProject.projectName, "Test Project");
    assert.equal(paranoidDeletedProject.projectKey, "TEST");
    assert.ok(!!paranoidDeletedProject.deletedAt);
  });
});
