import express from "express";
import {userService} from "../../domain/services.index";
import {JoiValidator} from "../../lib/joi/joi.validator";
import {AdminValidationMiddleware} from "../web.api.middleware/admin.validation.middleware";
import {CreateUsersController} from "./create.users/create.users.controller";
import {createUsersBodySchema} from "./create.users/create.users.validation";
import {LoginUserController} from "./login.user/login.user.controlller";
import {loginUsersBodySchema} from "./login.user/login.user.validation";
import {UpdateUserController} from "./update.user/update.user.controller";
import {updateUserBodySchema} from "./update.user/update.user.validation";

const loginUserController = new LoginUserController(userService);
const createUsersController = new CreateUsersController(userService);
const updateUserController = new UpdateUserController(userService);

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
  "/update",
  JoiValidator.bodySchemaValidationMiddleware(updateUserBodySchema),
  updateUserController.handle.bind(updateUserController)
);

export default userRouter;
