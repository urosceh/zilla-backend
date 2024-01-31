import test, {after, before, describe} from "node:test";
import {AdminUserWrapper} from "../wrappers/admin.user.wrapper";

describe("AdminUserModel Integration Tests", () => {
  const adminUserWrapper = new AdminUserWrapper();

  const ids: number[] = [];

  before(async () => {
    await adminUserWrapper.setup();
  });

  after(async () => {
    await adminUserWrapper.cleanup(ids);
  });

  test.skip("should test AdminUserModel associations", async () => {
    // const user = adminUserWrapper.testUserModels[0];
    // await AdminUserModel.create({
    //   userId: user.userId,
    // });
    // const adminUser = await AdminUserModel.findOne({
    //   where: {
    //     userId: user.userId,
    //   },
    //   include: [
    //     {
    //       model: UserModel,
    //       as: "user",
    //     },
    //   ],
    // });
    // assert.ok(!!adminUser);
    // assert.ok(!!adminUser.id);
    // assert.ok(!!adminUser.createdAt);
    // assert.equal(adminUser.userId, user.userId);
    // assert.ok(adminUser.user instanceof UserModel);
    // assert.equal(adminUser.user.email, "john.doe@gmail.com");
    // ids.push(adminUser.id);
    // // should not be able to force delete the user
    // await assert.rejects(async () => {
    //   await user.destroy({
    //     force: true,
    //   });
    // });
    // await adminUser.destroy();
    // assert.ok(await adminUserWrapper.doesNotExist(user.userId));
  });
});
