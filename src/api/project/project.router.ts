import express from "express";
import {adminUserService, projectService} from "../../domain/services.index";
import {JoiValidator} from "../../lib/joi/joi.validator";
import {CreateProjectController} from "./create.project/create.project.controller";
import {createProjectBodySchema} from "./create.project/create.project.validation";

const createProjectController = new CreateProjectController(projectService, adminUserService);

const projectRouter = express.Router();

projectRouter.post(
  "/create",
  JoiValidator.bodySchemaValidationMiddleware(createProjectBodySchema),
  createProjectController.handle.bind(createProjectController)
);

export default projectRouter;
