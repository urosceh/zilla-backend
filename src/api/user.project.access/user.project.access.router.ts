import express from "express";
import {projectService, userProjectAccessService} from "../../domain/services.index";
import {JoiValidator} from "../../lib/joi/joi.validator";
import {GiveAccessController} from "./give.access/give.access.controller";
import {giveAccessBodySchema} from "./give.access/give.access.validation";

const giveAccessController = new GiveAccessController(userProjectAccessService, projectService);

const accessRouter = express.Router();

accessRouter.post(
  "/",
  JoiValidator.bodySchemaValidationMiddleware(giveAccessBodySchema),
  giveAccessController.handle.bind(giveAccessController)
);

export default accessRouter;
