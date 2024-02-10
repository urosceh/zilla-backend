import express from "express";
import {adminUserService, userProjectAccessService, userService} from "../../domain/services.index";
import {RedisClient} from "../../external/redis/redis.client";
import {JoiValidator} from "../../lib/joi/joi.validator";
import {AdminValidationMiddleware} from "../web.api.middleware/admin.validation.middleware";
import {ChangePasswordController} from "./change.password/change.password.controller";
import {changePasswordBodySchema} from "./change.password/change.password.validation";
import {CreateUsersController} from "./create.users/create.users.controller";
import {createUsersBodySchema} from "./create.users/create.users.validation";
import {ForgottenPasswordController} from "./forgotten.password/forgotten.password.controller";
import {forgottenPasswordBodySchema} from "./forgotten.password/forgotten.password.validation";
import {GetAllUsersController} from "./get.all.users/get.all.users.controller";
import {getAllUsersQuerySchema} from "./get.all.users/get.all.users.validation";
import {LoginUserController} from "./login.user/login.user.controlller";
import {loginUsersBodySchema} from "./login.user/login.user.validation";
import {SetForgottenPasswordController} from "./set.forgotten.password/set.forgotten.password.controller";
import {setForgottenPasswordBodySchema} from "./set.forgotten.password/set.forgotten.password.validation";
import {UpdateUserController} from "./update.user/update.user.controller";
import {updateUserBodySchema} from "./update.user/update.user.validation";

const loginUserController = new LoginUserController(userService);
const createUsersController = new CreateUsersController(userService);
const updateUserController = new UpdateUserController(userService);
const changePasswordController = new ChangePasswordController(userService);
const forgottenPasswordController = new ForgottenPasswordController(userService, RedisClient.getInstance());
const setForgottenPasswordController = new SetForgottenPasswordController(userService, RedisClient.getInstance());
const getAllUsersController = new GetAllUsersController(userService, userProjectAccessService, adminUserService);

const userRouter = express.Router();

userRouter.post(
  "/login",
  JoiValidator.bodySchemaValidationMiddleware(loginUsersBodySchema),
  loginUserController.handle.bind(loginUserController)
);

userRouter.post(
  "/create-batch",
  AdminValidationMiddleware.middleware,
  JoiValidator.bodySchemaValidationMiddleware(createUsersBodySchema),
  createUsersController.handle.bind(createUsersController)
);

userRouter.patch(
  "/",
  JoiValidator.bodySchemaValidationMiddleware(updateUserBodySchema),
  updateUserController.handle.bind(updateUserController)
);

userRouter.put(
  "/password",
  JoiValidator.bodySchemaValidationMiddleware(changePasswordBodySchema),
  changePasswordController.handle.bind(changePasswordController)
);

userRouter.post(
  "/forgotten-password",
  AdminValidationMiddleware.middleware,
  JoiValidator.bodySchemaValidationMiddleware(forgottenPasswordBodySchema),
  forgottenPasswordController.handle.bind(forgottenPasswordController)
);

userRouter.post(
  "/set-forgotten-password",
  JoiValidator.bodySchemaValidationMiddleware(setForgottenPasswordBodySchema),
  setForgottenPasswordController.handle.bind(setForgottenPasswordController)
);

userRouter.get(
  "/all",
  JoiValidator.querySchemaValidationMiddleware(getAllUsersQuerySchema),
  getAllUsersController.handle.bind(getAllUsersController)
);

export default userRouter;
