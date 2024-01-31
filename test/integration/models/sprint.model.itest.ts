import test, {before, describe} from "node:test";
import {SprintWrapper} from "../wrappers/sprint.wrapper";

describe("SprintModel Integration Tests", () => {
  const sprintWrapper = new SprintWrapper();

  before(async () => {
    await sprintWrapper.setup();
  });

  test.skip("should test SprintModel associations", async () => {
    // const project = sprintWrapper.testProjectModels.find((project) => project.projectKey === "PJC1")!;
    // assert(!!project.projectId);
    // await SprintModel.create({
    //   sprintName: "Test Model Sprint",
    //   projectId: project.projectId,
    //   startOfSprint: new Date(),
    //   endOfSprint: new Date(),
    // });
    // const sprint = await SprintModel.findOne({
    //   where: {
    //     projectId: project.projectId,
    //     sprintName: "Test Model Sprint",
    //   },
    //   include: [
    //     {
    //       model: ProjectModel,
    //       as: "project",
    //     },
    //   ],
    // });
    // assert.ok(!!sprint);
    // assert.equal(sprint.sprintName, "Test Model Sprint");
    // assert.ok(sprint.project instanceof ProjectModel);
    // const projectWithSprints = await ProjectModel.findOne({
    //   where: {
    //     projectId: project.projectId,
    //   },
    //   include: [
    //     {
    //       model: SprintModel,
    //       as: "sprints",
    //     },
    //   ],
    // });
    // assert.ok(!!projectWithSprints);
    // assert.ok(projectWithSprints.sprints instanceof Array<SprintModel>);
    // assert.ok(projectWithSprints.sprints.find((sprint) => sprint.sprintName === "Test Model Sprint"));
    // await sprint.destroy();
    // const deletedSprint = await SprintModel.findOne({
    //   where: {
    //     projectId: project.projectId,
    //   },
    // });
    // assert.ok(!deletedSprint);
  });
});
