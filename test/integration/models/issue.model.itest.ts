import assert from "node:assert";
import test, {after, describe} from "node:test";
import IssueModel from "../../../src/database/models/issue.model";
import IssueStatusModel from "../../../src/database/models/issue.status.model";
import ProjectModel from "../../../src/database/models/project.model";
import UserModel from "../../../src/database/models/user.model";
import {IssueWrapper} from "../wrappers/issue.wrapper";

describe("IssueModel Integration Tests", () => {
  const issueWrapper = new IssueWrapper();

  after(async () => {
    await issueWrapper.cleanup();
  });

  test("should create and delete an issue", async () => {
    const reporter = await UserModel.create({
      email: "john.doe@gmail.com",
      password: "password",
    });

    const project = await ProjectModel.create({
      projectName: "Test Project",
      projectKey: "TEST",
      managerId: reporter.userId,
    });

    const issueStatus = await IssueStatusModel.create({
      statusName: "To Do",
    });

    const createdIssue = await IssueModel.create({
      projectId: project.projectId,
      reporterId: reporter.userId,
      issueStatusId: issueStatus.id,
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
        {
          model: IssueStatusModel,
          as: "issueStatus",
        },
      ],
    });

    assert.ok(!!issue);
    assert.equal(issue.summary, "Test Issue");
    assert.ok(issue.project instanceof ProjectModel);
    assert.ok(issue.project.manager instanceof UserModel);
    assert.ok(issue.reporter instanceof UserModel);
    assert.ok(issue.issueStatus instanceof IssueStatusModel);
  });
});
