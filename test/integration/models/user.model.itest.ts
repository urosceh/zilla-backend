import assert from "node:assert";
import test, {after, describe} from "node:test";
import UserModel from "../../../src/database/models/user.model";
import {UserWrapper} from "../wrappers/user.wrapper";

describe("UserModel Integration Tests", () => {
  const userWrapper = new UserWrapper();

  const userIds: string[] = [];

  after(async () => {
    await userWrapper.cleanup(userIds);
  });

  test("should create and paraniod delete a user", async () => {
    const user = await UserModel.create({
      email: "test@gmail.com",
      password: "password",
    });

    assert.ok(!!user.userId);
    assert.ok(!!user.createdAt);
    assert.ok(!!user.updatedAt);
    assert.ok(!!user.password);
    assert.equal(user.email, "test@gmail.com");

    userIds.push(user.userId);

    // Paraniod delete the user
    await user.destroy();

    const paranoidDeletedUsers = await UserModel.findOne({
      where: {
        email: "test@gmail.com",
      },
      paranoid: false,
    });

    assert.ok(!!paranoidDeletedUsers);
    assert.equal(paranoidDeletedUsers.email, "test@gmail.com");
    assert.ok(!!paranoidDeletedUsers.deletedAt);
  });
});
