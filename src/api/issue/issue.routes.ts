import express from "express";
import {issueService} from "../../domain/services.index";
import {JoiValidator} from "../../lib/joi/joi.validator";
import {getIssuesParamsSchema} from "../abstract/validations";
import {AccessValidationMiddleware} from "../web.api.middleware/access.validation.middleware";
import {CreateIssueController} from "./create.issue/create.issue.controller";
import {createIssueBodySchema} from "./create.issue/create.issue.validation";
import {GetIssueController} from "./get.issue/get.issue.controller";
import {getIssueParamsSchema, getIssueQuerySchema} from "./get.issue/get.issue.validation";
import {GetProjectIssuesController} from "./get.project.issues/get.project.issues.controller";
import {getProjectIssuesQuerySchema} from "./get.project.issues/get.project.issues.validation";
import {UpdateIssueController} from "./update.issue/update.issue.controller";
import {updateIssueBodySchema, updateIssueParamsSchema} from "./update.issue/update.issue.validation";

const getProjectIssuesController = new GetProjectIssuesController(issueService);
const createIssueController = new CreateIssueController(issueService);
const getIssueController = new GetIssueController(issueService);
const updateIssueController = new UpdateIssueController(issueService);

const issueRouter = express.Router();

issueRouter.get(
  "/project/:projectKey",
  AccessValidationMiddleware.middleware,
  JoiValidator.paramsSchemaValidationMiddleware(getIssuesParamsSchema),
  JoiValidator.querySchemaValidationMiddleware(getProjectIssuesQuerySchema),
  getProjectIssuesController.handle.bind(getProjectIssuesController)
);

issueRouter.get(
  "/:issueId",
  AccessValidationMiddleware.middleware,
  JoiValidator.paramsSchemaValidationMiddleware(getIssueParamsSchema),
  JoiValidator.querySchemaValidationMiddleware(getIssueQuerySchema),
  getIssueController.handle.bind(getIssueController)
);

issueRouter.patch(
  "/:issueId",
  AccessValidationMiddleware.middleware,
  JoiValidator.bodySchemaValidationMiddleware(updateIssueBodySchema),
  JoiValidator.paramsSchemaValidationMiddleware(updateIssueParamsSchema),
  updateIssueController.handle.bind(updateIssueController)
);

issueRouter.post(
  "/",
  AccessValidationMiddleware.middleware,
  JoiValidator.bodySchemaValidationMiddleware(createIssueBodySchema),
  createIssueController.handle.bind(createIssueController)
);

export default issueRouter;
