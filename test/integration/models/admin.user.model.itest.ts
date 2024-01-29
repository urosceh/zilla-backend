import assert from "node:assert";
import test, {after, describe} from "node:test";
import AdminUserModel from "../../../src/database/models/admin.user.model";
import UserModel from "../../../src/database/models/user.model";
import {AdminUserWrapper} from "../wrappers/admin.user.wrapper";

describe("AdminUserModel Integration Tests", () => {
  const adminUserWrapper = new AdminUserWrapper();

  after(async () => {
    await adminUserWrapper.cleanup();
  });

  test("should create and delete an admin user", async () => {
    const user = await UserModel.create({
      email: "john.doe@gmail.com",
      password: "password",
    });

    assert.ok(!!user.userId);

    await AdminUserModel.create({
      userId: user.userId,
    });

    const adminUser = await AdminUserModel.findOne({
      where: {
        userId: user.userId,
      },
      include: [
        {
          model: UserModel,
          as: "user",
        },
      ],
    });

    assert.ok(!!adminUser);
    assert.ok(!!adminUser.id);
    assert.ok(!!adminUser.createdAt);
    assert.equal(adminUser.userId, user.userId);
    assert.ok(adminUser.user instanceof UserModel);
    assert.equal(adminUser.user.email, "john.doe@gmail.com");

    // should not be able to force delete the user
    await assert.rejects(async () => {
      await user.destroy({
        force: true,
      });
    });

    await adminUser.destroy();

    assert.ok(await adminUserWrapper.doesNotExist(user.userId));
  });
});
