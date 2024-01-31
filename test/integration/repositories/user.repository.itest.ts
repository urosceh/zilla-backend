import assert from "node:assert";
import test, {after, describe} from "node:test";
import {UserRepository} from "../../../src/database/repositories/user.repository";
import {User} from "../../../src/domain/entities/User";
import {UserWrapper} from "../wrappers/user.wrapper";

describe("UserRepository Integration Tests", () => {
  const userRepository = new UserRepository();
  const userWrapper = new UserWrapper();

  const userIds: string[] = [];

  after(async () => {
    await userWrapper.cleanup(userIds);
  });

  test("should create a batch of users and log them in", async () => {
    await userRepository.createBatch([
      {
        email: "test.pera@gmail.com",
        password: "password.pera",
      },
      {
        email: "test.zika@gmail.com",
        password: "password.zika",
      },
    ]);

    const [pera, zika, steva] = await Promise.allSettled([
      userRepository.loginUser({email: "test.pera@gmail.com", password: "password.pera"}),
      userRepository.loginUser({email: "test.zika@gmail.com", password: "password.not.zika"}),
      userRepository.loginUser({email: "test.steva@gmail.com", password: "password.steva"}),
    ]);

    assert.ok(pera.status === "fulfilled");
    assert.ok(pera.value instanceof User);

    assert.ok(zika.status === "rejected");
    assert.equal(zika.reason.message, "Invalid password");

    assert.ok(steva.status === "rejected");
    assert.equal(steva.reason.message, "Invalid email");
  });
});
