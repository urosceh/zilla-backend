import cors from "cors";
import express from "express";
import adminRouter from "./admin.user/admin.user.router";
import issueRouter from "./issue/issue.router";
import healthRouter from "./health/health.router";
import issueStatusRouter from "./issueStatus/issue.status.router";
import projectRouter from "./project/project.router";
import sprintRouter from "./sprint/sprint.router";
import accessRouter from "./user.project.access/user.project.access.router";
import userRouter from "./user/user.router";
import {ErrorHandlingMiddleware} from "./web.api.middleware/error.handling.middleware";
import {TokenMiddleware} from "./web.api.middleware/token.middleware";

const router = express.Router();

router.use(cors());

router.use(express.json({limit: "1mb", type: "application/json"}));

router.use(TokenMiddleware.middleware);

router.use("/health", healthRouter);
router.use("/user", userRouter);
router.use("/admin", adminRouter);
router.use("/project", projectRouter);
router.use("/access", accessRouter);
router.use("/sprint", sprintRouter);
router.use("/issue", issueRouter);
router.use("/issue-status", issueStatusRouter);

router.use(ErrorHandlingMiddleware.handleErrors);

export default router;
