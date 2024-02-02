import express from "express";
import {issueService} from "../../domain/services.index";
import {JoiValidator} from "../../lib/joi/joi.validator";
import {createUsersBodySchema} from "../user/create.users/create.users.validation";
import {AccessValidationMiddleware} from "../web.api.middleware/access.validation.middleware";
import {CreateIssueController} from "./create.issue/create.issue.controller";
import {GetIssueController} from "./get.issue/get.issue.controller";
import {getIssueParamsSchema, getIssueQuerySchema} from "./get.issue/get.issue.validation";

const createIssueController = new CreateIssueController(issueService);
const getIssueController = new GetIssueController(issueService);

const issueRouter = express.Router();

issueRouter.get(
  "/:issueId",
  AccessValidationMiddleware.middleware,
  JoiValidator.paramsSchemaValidationMiddleware(getIssueParamsSchema),
  JoiValidator.querySchemaValidationMiddleware(getIssueQuerySchema),
  getIssueController.handle.bind(getIssueController)
);

issueRouter.post(
  "/",
  AccessValidationMiddleware.middleware,
  JoiValidator.bodySchemaValidationMiddleware(createUsersBodySchema),
  createIssueController.handle.bind(createIssueController)
);

export default issueRouter;
