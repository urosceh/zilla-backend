import assert from "assert";
import test, {after, before, describe} from "node:test";
import ProjectModel from "../../../src/database/models/project.model";
import SprintModel from "../../../src/database/models/sprint.model";
import UserModel from "../../../src/database/models/user.model";
import {IssueRepository} from "../../../src/database/repositories/issue.repository";
import {Sprint} from "../../../src/domain/entities/Sprint";
import {User} from "../../../src/domain/entities/User";
import {IssueStatus} from "../../../src/domain/enums/IssueStatus";
import {IssueWrapper} from "../wrappers/issue.wrapper";

describe("IssueModel Integration Tests", () => {
  const issueRepository = new IssueRepository();
  const issueWrapper = new IssueWrapper();

  const issueIds: string[] = [];

  before(async () => {
    await issueWrapper.setup();
  });

  after(async () => {
    await issueWrapper.cleanup(issueIds);
  });

  test("should create an issue", async () => {
    const reporter: UserModel = issueWrapper.testUserModels.find((user) => user.email === "john.doe@gmail.com")!;
    const project: ProjectModel = issueWrapper.testProjectModels.find((project) => project.projectKey === "PJC1")!;
    const sprint: SprintModel = issueWrapper.testSprintModels.find(
      (sprint) => sprint.sprintName === "Sprint 1" && sprint.projectId === project.projectId
    )!;

    const createdIssue = await issueRepository.createIssue({
      projectId: project.projectId,
      reporterId: reporter.userId,
      assigneeId: reporter.userId,
      summary: "Test Repo Issue",
      sprintId: sprint.sprintId,
      issueStatus: IssueStatus.IN_REVIEW,
      details: "Test Issue Details",
    });

    assert.ok(!!createdIssue);
    assert.ok(!!createdIssue.issueId);
    assert.ok(!!createdIssue.createdAt);
    assert.equal(createdIssue.summary, "Test Repo Issue");
    assert.equal(createdIssue.issueStatus, "In Review");
    assert.equal(createdIssue.details, "Test Issue Details");
    // assert.ok(createdIssue.reporter instanceof User);
    // assert.equal(createdIssue.reporter.email, "john.doe@gmail.com");
    // assert.ok(createdIssue.assignee instanceof User);
    // assert.equal(createdIssue.assignee.email, "john.doe@gmail.com");
    // assert.ok(createdIssue.sprint instanceof Sprint);
    // assert.equal(createdIssue.sprint.sprintName, "Sprint 1");

    issueIds.push(createdIssue.issueId);
  });

  test("should get all project issues in created order with limit and offset", async () => {
    const project: ProjectModel = issueWrapper.testProjectModels.find((project) => project.projectKey === "PJC1")!;

    const issues = await issueRepository.getAllProjectIssues(project.projectId, {
      limit: 2,
      offset: 1,
      orderCol: "createdAt",
      orderDir: "ASC",
    });

    const issue2 = issues.find((issue) => issue.summary === "PJC1 Issue 2");
    const issue3 = issues.find((issue) => issue.summary === "PJC1 Issue 3");

    assert.ok(!!issue2);
    assert.ok(!issue2.sprint);
    assert.ok(issue2.reporter instanceof User);
    assert.ok(issue2.assignee instanceof User);

    assert.ok(!!issue3);
    assert.ok(issue3.sprint instanceof Sprint);
    assert.ok(issue3.reporter instanceof User);
    assert.ok(!issue3.assignee);
  });
});
