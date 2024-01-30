import assert from "node:assert";
import test, {after, describe} from "node:test";
import ProjectModel from "../../../src/database/models/project.model";
import UserModel from "../../../src/database/models/user.model";
import UserProjectAccessModel from "../../../src/database/models/user.project.access.model";
import {UserProjectAccessWrapper} from "../wrappers/user.project.access.wrapper";

describe("UserProjectAccessModel Integration Tests", () => {
  const userProjectAccessWrapper = new UserProjectAccessWrapper();

  after(async () => {
    await userProjectAccessWrapper.cleanup();
  });

  test("should create and delete a user project access", async () => {
    const users = await UserModel.bulkCreate([
      {
        email: "john.doe@gmail.com",
        password: "password",
      },
      {
        email: "doe.john@gmail.com",
        password: "password",
      },
    ]);

    assert.ok(users.length === 2);
    assert.ok(!!users[0].userId);
    assert.ok(!!users[1].userId);

    const projects = await ProjectModel.bulkCreate([
      {
        projectName: "Test Project 1",
        projectKey: "TEST1",
        managerId: users[0].userId,
      },
      {
        projectName: "Test Project 2",
        projectKey: "TEST2",
        managerId: users[0].userId,
      },
    ]);

    assert.ok(projects.length === 2);
    assert.ok(!!projects[0].projectId);
    assert.ok(!!projects[1].projectId);

    await UserProjectAccessModel.bulkCreate([
      {
        userId: users[1].userId,
        projectKey: projects[0].projectKey,
      },
      {
        userId: users[1].userId,
        projectKey: projects[1].projectKey,
      },
    ]);

    const userProjectAcesses = await UserProjectAccessModel.findAll({
      where: {
        userId: users[1].userId,
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
          as: "user",
        },
      ],
    });

    assert.ok(userProjectAcesses.length === 2);
    for (const upa of userProjectAcesses) {
      assert.ok(!!upa.id);
      assert.ok(upa.user instanceof UserModel);
      assert.ok(upa.project instanceof ProjectModel);
      assert.ok(upa.project.manager instanceof UserModel);
    }

    await projects[1].destroy({force: true});

    const upaByProject = await userProjectAccessWrapper.getByProjectKey(projects[1].projectKey);
    assert.ok(upaByProject.length === 0);

    await users[1].destroy({force: true});

    const upaByUser = await userProjectAccessWrapper.getByUserId(users[1].userId);
    assert.ok(upaByUser.length === 0);
  });
});
