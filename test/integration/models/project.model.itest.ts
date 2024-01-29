import assert from "node:assert";
import test, {after, describe} from "node:test";
import ProjectModel from "../../../src/database/models/project.model";
import UserModel from "../../../src/database/models/user.model";
import {ProjectWrapper} from "../wrappers/project.wrapper";

describe("ProjectModel Integration Tests", () => {
  const projectWrapper = new ProjectWrapper();

  after(async () => {
    await projectWrapper.cleanup();
  });

  test("should create and delete a project", async () => {
    const user = await UserModel.create({
      email: "joe.doe@gmail.com",
      password: "password",
    });

    assert.ok(!!user.userId);

    await ProjectModel.create({
      projectName: "Test Project",
      projectKey: "TEST",
      managerId: user.userId,
    });

    const project = await ProjectModel.findOne({
      where: {
        managerId: user.userId,
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
    assert.equal(project.manager.email, "joe.doe@gmail.com");

    await assert.rejects(async () => {
      await user.destroy({
        force: true,
      });
    });

    const projectId: string = project.projectId;

    await project.destroy();

    const paranoidDeletedProject = await projectWrapper.getProject(projectId);

    assert.equal(paranoidDeletedProject.project_name, "Test Project");
    assert.equal(paranoidDeletedProject.project_key, "TEST");
    assert.ok(!!paranoidDeletedProject.deleted_at);
  });
});
