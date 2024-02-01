import assert from "node:assert";
import test, {after, before, describe} from "node:test";
import {UserProjectAccessRepository} from "../../../src/database/repositories/user.project.access.repository";
import {UserProjectAccessWrapper} from "../wrappers/user.project.access.wrapper";

describe("UserProjectAccessRepository Integration Tests", () => {
  const userProjectAccessRepository = new UserProjectAccessRepository();
  const userProjectAccessWrapper = new UserProjectAccessWrapper();

  const userProjectAccessIds: string[] = [];

  before(async () => {
    await userProjectAccessWrapper.setup();
  });

  after(async () => {
    await userProjectAccessWrapper.cleanup(userProjectAccessIds);
  });

  test("should give, check and revoke access to a user", async () => {
    const users = userProjectAccessWrapper.testUserModels.filter((user) =>
      ["john.doe@gmail.com", "jane.doe@gmail.com"].includes(user.email)
    );

    assert.ok(users.length === 2);

    const projects = userProjectAccessWrapper.testProjectModels.filter((project) => ["PJC1", "PJC2"].includes(project.projectKey));

    assert.ok(projects.length === 2);

    await Promise.all([
      userProjectAccessRepository.insertAccess([users[0].userId], projects[0].projectKey),
      userProjectAccessRepository.insertAccess([users[1].userId], projects[1].projectKey),
    ]);

    const [u1p1, u1p2, u2p1, u2p2] = await Promise.all([
      userProjectAccessRepository.hasAccess(users[0].userId, projects[0].projectKey),
      userProjectAccessRepository.hasAccess(users[0].userId, projects[1].projectKey),
      userProjectAccessRepository.hasAccess(users[1].userId, projects[0].projectKey),
      userProjectAccessRepository.hasAccess(users[1].userId, projects[1].projectKey),
    ]);

    assert.ok(u1p1);
    assert.ok(!u1p2);
    assert.ok(!u2p1);
    assert.ok(u2p2);

    await Promise.all([
      userProjectAccessRepository.deleteAccess([users[0].userId], projects[0].projectKey),
      userProjectAccessRepository.deleteAccess([users[1].userId], projects[1].projectKey),
    ]);

    const [u1p1r, u2p2r] = await Promise.all([
      userProjectAccessRepository.hasAccess(users[0].userId, projects[0].projectKey),
      userProjectAccessRepository.hasAccess(users[1].userId, projects[1].projectKey),
    ]);

    assert.ok(!u1p1r);
    assert.ok(!u2p2r);
  });
});
