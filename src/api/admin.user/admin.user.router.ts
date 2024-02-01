import express from "express";
import {adminUserService} from "../../domain/services.index";
import {JoiValidator} from "../../lib/joi/joi.validator";
import {AdminValidationMiddleware} from "../web.api.middleware/admin.validation.middleware";
import {MakeAdminController} from "./make.admin/make.admin.controller";
import {makeAdminParamsSchema} from "./make.admin/make.admin.validation";

const makeAdminController = new MakeAdminController(adminUserService);

const adminRouter = express.Router();

adminRouter.post(
  "/make-user-admin/:userId",
  AdminValidationMiddleware.middleware,
  JoiValidator.paramsSchemaValidationMiddleware(makeAdminParamsSchema),
  makeAdminController.handle.bind(makeAdminController)
);

export default adminRouter;
