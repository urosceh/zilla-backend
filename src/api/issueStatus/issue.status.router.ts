import express from "express";
import {TokenMiddleware} from "../web.api.middleware/token.middleware";
import {GetIssueStatusesController} from "./get.issue.statuses.controller";

const getIssueStatusesController = new GetIssueStatusesController();

const issueStatusRouter = express.Router();

issueStatusRouter.get("/", TokenMiddleware.middleware, getIssueStatusesController.handle.bind(getIssueStatusesController));

export default issueStatusRouter;
