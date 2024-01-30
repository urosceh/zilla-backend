import assert from "node:assert";
import test, {after, describe} from "node:test";
import ProjectModel from "../../../src/database/models/project.model";
import SprintModel from "../../../src/database/models/sprint.model";
import UserModel from "../../../src/database/models/user.model";
import {SprintWrapper} from "../wrappers/sprint.wrapper";

describe("SprintModel Integration Tests", () => {
  const sprintWrapper = new SprintWrapper();

  after(async () => {
    await sprintWrapper.cleanup();
  });

  test("should create and delete a sprint", async () => {
    const user = await UserModel.create({
      email: "john.doe@gmail.com",
      password: "password",
    });

    assert(!!user.userId);

    const project = await ProjectModel.create({
      projectName: "Test Project",
      projectKey: "TEST",
      managerId: user.userId,
    });

    assert(!!project.projectId);

    await SprintModel.create({
      sprintName: "Test Sprint",
      projectId: project.projectId,
      startOfSprint: new Date(),
      endOfSprint: new Date(),
    });

    const sprint = await SprintModel.findOne({
      where: {
        projectId: project.projectId,
      },
      include: [
        {
          model: ProjectModel,
          as: "project",
        },
      ],
    });

    assert.ok(!!sprint);
    assert.equal(sprint.sprintName, "Test Sprint");
    assert.ok(sprint.project instanceof ProjectModel);

    const projectWithSprints = await ProjectModel.findOne({
      where: {
        projectId: project.projectId,
      },
      include: [
        {
          model: SprintModel,
          as: "sprints",
        },
      ],
    });

    assert.ok(!!projectWithSprints);

    await project.destroy({force: true});

    const deletedSprint = await SprintModel.findOne({
      where: {
        projectId: project.projectId,
      },
    });

    assert.ok(!deletedSprint);
  });
});
