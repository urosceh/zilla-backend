import express from "express";
import {userService} from "../../domain/services.index";
import {bodySchemaValidationMiddleware} from "../../lib/joi/joi.index";
import {CreateUsersController} from "./create.users/create.users.controller";
import {createUsersBodySchema} from "./create.users/create.users.validation";

const createUsersController = new CreateUsersController(userService);

const userRouter = express.Router();
userRouter.post(
  "/create-batch",
  bodySchemaValidationMiddleware(createUsersBodySchema),
  createUsersController.handle.bind(createUsersController)
);

export default userRouter;
