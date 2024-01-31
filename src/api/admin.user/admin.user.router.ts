import express from "express";
import {adminUserService} from "../../domain/services.index";
import {JoiValidator} from "../../lib/joi/joi.validator";
import {MakeAdminController} from "./make.admin/make.admin.controller";
import {makeAdminParamsSchema} from "./make.admin/make.admin.validation";

const makeAdminController = new MakeAdminController(adminUserService);

const adminRouter = express.Router();

adminRouter.post(
  "/make-user-admin/:userId",
  JoiValidator.paramsSchemaValidationMiddleware(makeAdminParamsSchema),
  makeAdminController.handle.bind(makeAdminController)
);

export default adminRouter;
