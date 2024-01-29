import assert from "node:assert";
import test, {after, describe} from "node:test";
import UserModel from "../../../src/database/models/user.model";
import {UserWrapper} from "../wrappers/user.wrapper";

describe("User model integration tests", () => {
  const userWrapper = new UserWrapper();

  after(async () => {
    await userWrapper.cleanup();
  });

  test("should create and paraniod delete a user", async () => {
    // Create a user
    const user = await UserModel.create({
      email: "john.doe@gmail.com",
      password: "password",
    });

    assert.ok(!!user.userId);
    assert.equal(user.email, "john.doe@gmail.com");

    // Paraniod delete the user
    await user.destroy();

    const paranoidDeletedUsers = await userWrapper.getUser(user.userId);

    assert.equal(paranoidDeletedUsers.email, "john.doe@gmail.com");
    assert.ok(!!paranoidDeletedUsers.deleted_at);
  });
});
