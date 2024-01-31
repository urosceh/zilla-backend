import assert from "node:assert";
import test, {after, before, describe} from "node:test";
import IssueModel from "../../../src/database/models/issue.model";
import ProjectModel from "../../../src/database/models/project.model";
import UserModel from "../../../src/database/models/user.model";
import {IssueWrapper} from "../wrappers/issue.wrapper";

describe("IssueModel Integration Tests", () => {
  const issueWrapper = new IssueWrapper();

  const issueIds: string[] = [];

  before(async () => {
    await issueWrapper.setup();
  });

  after(async () => {
    await issueWrapper.cleanup(issueIds);
  });

  test("should create and paranoid delete an issue", async () => {
    const reporter: UserModel = issueWrapper.testUserModels.find((user) => user.email === "john.doe@gmail.com")!;
    const project: ProjectModel = issueWrapper.testProjectModels.find((project) => project.projectKey === "PJC1")!;

    const createdIssue = await IssueModel.create({
      projectId: project.projectId,
      reporterId: reporter.userId,
      summary: "Test Issue",
    });

    const issue = await IssueModel.findOne({
      where: {
        issueId: createdIssue.issueId,
      },
      include: [
        {
          model: ProjectModel,
          as: "project",
          include: [
            {
              model: UserModel,
              as: "manager",
            },
          ],
        },
        {
          model: UserModel,
          as: "reporter",
        },
      ],
    });

    assert.ok(!!issue);
    assert.equal(issue.summary, "Test Issue");
    assert.ok(issue.issueStatus === "Backlog");
    assert.ok(issue.project instanceof ProjectModel);
    assert.ok(issue.project.manager instanceof UserModel);
    assert.ok(issue.reporter instanceof UserModel);

    issueIds.push(issue.issueId);

    await issue.destroy();

    const deletedIssue = await IssueModel.findOne({
      where: {
        issueId: createdIssue.issueId,
      },
      paranoid: false,
    });

    assert.ok(!!deletedIssue);
    assert.ok(!!deletedIssue.deletedAt);
  });
});
