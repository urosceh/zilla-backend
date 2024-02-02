import express from "express";
import {sprintService} from "../../domain/services.index";
import {JoiValidator} from "../../lib/joi/joi.validator";
import {ManagerValidationMiddleware} from "../web.api.middleware/menager.validation.middleware";
import {CreateSprintController} from "./create.sprint/create.sprint.controller";
import {createSprintBodySchema} from "./create.sprint/create.sprint.validation";

const createSprintController = new CreateSprintController(sprintService);

const sprintRouter = express.Router();

sprintRouter.post(
  "/",
  ManagerValidationMiddleware.middleware,
  JoiValidator.bodySchemaValidationMiddleware(createSprintBodySchema),
  createSprintController.handle.bind(createSprintController)
);

export default sprintRouter;
