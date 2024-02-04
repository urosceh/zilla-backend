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

const createIssueController = new CreateIssueController(issueService);
const getIssueController = new GetIssueController(issueService);
const getProjectIssuesController = new GetProjectIssuesController(issueService);

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
  JoiValidator.bodySchemaValidationMiddleware(createIssueBodySchema),
  createIssueController.handle.bind(createIssueController)
);

issueRouter.get(
  "/project/:projectKey",
  AccessValidationMiddleware.middleware,
  JoiValidator.paramsSchemaValidationMiddleware(getIssuesParamsSchema),
  JoiValidator.querySchemaValidationMiddleware(getProjectIssuesQuerySchema),
  getProjectIssuesController.handle.bind(getProjectIssuesController)
);

export default issueRouter;
