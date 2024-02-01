import express from "express";
import {userProjectAccessService} from "../../domain/services.index";
import {JoiValidator} from "../../lib/joi/joi.validator";
import {ManagerValidationMiddleware} from "../web.api.middleware/menager.validation.middleware";
import {GiveAccessController} from "./give.access/give.access.controller";
import {giveAccessBodySchema} from "./give.access/give.access.validation";

const giveAccessController = new GiveAccessController(userProjectAccessService);

const accessRouter = express.Router();

accessRouter.post(
  "/",
  ManagerValidationMiddleware.middleware,
  JoiValidator.bodySchemaValidationMiddleware(giveAccessBodySchema),
  giveAccessController.handle.bind(giveAccessController)
);

export default accessRouter;
