import express from "express";
import {adminUserService} from "../../domain/services.index";
import {paramsSchemaValidationMiddleware} from "../../lib/joi/joi.index";
import {MakeAdminController} from "./make.admin/make.admin.controller";
import {makeAdminParamsSchema} from "./make.admin/make.admin.validation";

const makeAdminController = new MakeAdminController(adminUserService);

const adminRouter = express.Router();

adminRouter.post(
  "/make-user-admin/:userId",
  paramsSchemaValidationMiddleware(makeAdminParamsSchema),
  makeAdminController.handle.bind(makeAdminController)
);

export default adminRouter;
