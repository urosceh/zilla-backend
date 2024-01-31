import assert from "node:assert";
import test, {after, before, describe} from "node:test";
import ProjectModel from "../../../src/database/models/project.model";
import SprintModel from "../../../src/database/models/sprint.model";
import {SprintWrapper} from "../wrappers/sprint.wrapper";

describe("SprintModel Integration Tests", () => {
  const sprintWrapper = new SprintWrapper();

  const sprintIds: number[] = [];

  before(async () => {
    await sprintWrapper.setup();
  });

  after(async () => {
    await sprintWrapper.cleanup(sprintIds);
  });

  test("should create and delete a sprint", async () => {
    const project = sprintWrapper.testProjectModels.find((project) => project.projectKey === "PJC1")!;

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

    sprintIds.push(sprint.sprintId);

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

    await sprint.destroy();

    const deletedSprint = await SprintModel.findOne({
      where: {
        projectId: project.projectId,
      },
    });

    assert.ok(!deletedSprint);
  });
});
