import express from "express";
import {projectService} from "../../domain/services.index";
import {JoiValidator} from "../../lib/joi/joi.validator";
import {AdminValidationMiddleware} from "../web.api.middleware/admin.validation.middleware";
import {CreateProjectController} from "./create.project/create.project.controller";
import {createProjectBodySchema} from "./create.project/create.project.validation";

const createProjectController = new CreateProjectController(projectService);

const projectRouter = express.Router();

projectRouter.post(
  "/create",
  AdminValidationMiddleware.middleware,
  JoiValidator.bodySchemaValidationMiddleware(createProjectBodySchema),
  createProjectController.handle.bind(createProjectController)
);

export default projectRouter;
