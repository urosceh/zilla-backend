import express from "express";
import {projectService} from "../../domain/services.index";
import {bodySchemaValidationMiddleware} from "../../lib/joi/joi.index";
import {CreateProjectController} from "./create.project/create.project.controller";
import {createProjectBodySchema} from "./create.project/create.project.validation";

const createProjectController = new CreateProjectController(projectService);

const projectRouter = express.Router();

projectRouter.post(
  "/create",
  bodySchemaValidationMiddleware(createProjectBodySchema),
  createProjectController.handle.bind(createProjectController)
);

export default projectRouter;
