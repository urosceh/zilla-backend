import assert from "node:assert";
import test, {after, before, describe} from "node:test";
import {SprintRepository} from "../../../src/database/repositories/sprint.repository";
import {Sprint} from "../../../src/domain/entities/Sprint";
import {SprintWithIssues} from "../../../src/domain/entities/SprintWithIssues";
import {SprintWrapper} from "../wrappers/sprint.wrapper";

describe("SprintModel Integration Tests", () => {
  const sprintRepository = new SprintRepository();
  const sprintWrapper = new SprintWrapper();

  const ids: number[] = [];

  before(async () => {
    await sprintWrapper.setup();
  });

  after(async () => {
    await sprintWrapper.cleanup(ids);
  });

  test("should create a sprint", async () => {
    const project = sprintWrapper.testProjectModels[0];

    const sprint: Sprint = await sprintRepository.createSprint({
      projectId: project.projectId,
      sprintName: "Test Sprint",
      startOfSprint: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7), // - 7 days
      endOfSprint: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7), // + 7 days
    });

    assert.ok(sprint instanceof Sprint);
    assert.ok(sprint.sprintId);

    ids.push(sprint.sprintId);
  });

  test("should get current sprint issues", async () => {
    const sprintIssues: SprintWithIssues = await sprintRepository.getCurrentSprintIssues(sprintWrapper.testProjectModels[0].projectId);

    assert.ok(sprintIssues instanceof Sprint);
    assert.ok(sprintIssues.issues.length === 2);

    assert.ok(!!sprintIssues.issues.find((issue) => issue.summary === "PJC1 Issue 1"));
    assert.ok(!!sprintIssues.issues.find((issue) => issue.summary === "PJC1 Issue 3"));
  });
});
