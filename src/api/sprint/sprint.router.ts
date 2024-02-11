import express from "express";
import {sprintService} from "../../domain/services.index";
import {JoiValidator} from "../../lib/joi/joi.validator";
import {AccessValidationMiddleware} from "../web.api.middleware/access.validation.middleware";
import {ManagerValidationMiddleware} from "../web.api.middleware/manager.validation.middleware";
import {CreateSprintController} from "./create.sprint/create.sprint.controller";
import {createSprintBodySchema} from "./create.sprint/create.sprint.validation";
import {GetProjectSprintsController} from "./get.project.sprints/get.project.sprints.controller";
import {getProjectSprintsParamsSchema} from "./get.project.sprints/get.project.sprints.validation";

const createSprintController = new CreateSprintController(sprintService);
const getProjectSprintsController = new GetProjectSprintsController(sprintService);

const sprintRouter = express.Router();

sprintRouter.post(
  "/",
  ManagerValidationMiddleware.middleware,
  JoiValidator.bodySchemaValidationMiddleware(createSprintBodySchema),
  createSprintController.handle.bind(createSprintController)
);

sprintRouter.get(
  "/:projectKey",
  AccessValidationMiddleware.middleware,
  JoiValidator.paramsSchemaValidationMiddleware(getProjectSprintsParamsSchema),
  getProjectSprintsController.handle.bind(getProjectSprintsController)
);

export default sprintRouter;
