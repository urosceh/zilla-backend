import express from "express";
import {userService} from "../../domain/services.index";
import {CreateUsersController} from "./create.users/create.users.controller";

const createUsersController = new CreateUsersController(userService);

const router = express.Router();

export const userRouter = router;
