import assert from "node:assert";
import test, {after, describe} from "node:test";
import IssueStatusModel from "../../../src/database/models/issue.status.model";
import {IssueStatusWrapper} from "../wrappers/issue.status.wrapper";

describe("IssueStatusModel Integration Tests", () => {
  const statusWrapper = new IssueStatusWrapper();

  after(async () => {
    await statusWrapper.cleanup();
  });

  test("should create and delete a status", async () => {
    const status = await IssueStatusModel.create({
      statusName: "Test Status",
    });

    assert.ok(!!status.id);

    await status.destroy();

    const statuses = await statusWrapper.getAll();

    assert.ok(statuses.length === 0);
  });
});
