import assert from "node:assert";
import test, {after, before, describe} from "node:test";
import ProjectModel from "../../../src/database/models/project.model";
import UserModel from "../../../src/database/models/user.model";
import UserProjectAccessModel from "../../../src/database/models/user.project.access.model";
import {UserProjectAccessWrapper} from "../wrappers/user.project.access.wrapper";

describe("UserProjectAccessModel Integration Tests", () => {
  const userProjectAccessWrapper = new UserProjectAccessWrapper();

  const ids: number[] = [];

  before(async () => {
    await userProjectAccessWrapper.setup();
  });

  after(async () => {
    await userProjectAccessWrapper.cleanup(ids);
  });

  test("should test UserProjectAccessModel associations", async () => {
    const user = userProjectAccessWrapper.testUserModels.find((u) => u.email === "john.doe@gmail.com");

    assert.ok(!!user);

    const userProjectAcesses = await UserProjectAccessModel.findAll({
      where: {
        userId: user.userId,
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

    assert.ok(userProjectAcesses.length > 0);
    for (const upa of userProjectAcesses) {
      assert.ok(!!upa.id);
      assert.ok(upa.user instanceof UserModel);
      assert.ok(upa.project instanceof ProjectModel);
      assert.ok(upa.project.manager instanceof UserModel);
    }
  });
});
