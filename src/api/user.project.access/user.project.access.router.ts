import express from "express";
import {userProjectAccessService} from "../../domain/services.index";
import {JoiValidator} from "../../lib/joi/joi.validator";
import {ManagerValidationMiddleware} from "../web.api.middleware/manager.validation.middleware";
import {GiveAccessController} from "./manage.access/give.access.controller";
import {manageAccessBodySchema} from "./manage.access/manage.access.validation";
import {RevokeAccessController} from "./manage.access/revoke.access.controller";

const giveAccessController = new GiveAccessController(userProjectAccessService);
const revokeAccessController = new RevokeAccessController(userProjectAccessService);

const accessRouter = express.Router();

accessRouter.post(
  "/",
  ManagerValidationMiddleware.middleware,
  JoiValidator.bodySchemaValidationMiddleware(manageAccessBodySchema),
  giveAccessController.handle.bind(giveAccessController)
);

accessRouter.delete(
  "/",
  ManagerValidationMiddleware.middleware,
  JoiValidator.bodySchemaValidationMiddleware(manageAccessBodySchema),
  revokeAccessController.handle.bind(revokeAccessController)
);

export default accessRouter;
