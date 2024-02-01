import express from "express";
import {projectService, userProjectAccessService} from "../../domain/services.index";
import {JoiValidator} from "../../lib/joi/joi.validator";
import {AdminValidationMiddleware} from "../web.api.middleware/admin.validation.middleware";
import {CreateProjectController} from "./create.project/create.project.controller";
import {createProjectBodySchema} from "./create.project/create.project.validation";
import {GetAllProjectsController} from "./get.all.projects/get.all.projects.controller";
import {getAllProjectsQuerySchema} from "./get.all.projects/get.all.projects.validation";

const createProjectController = new CreateProjectController(projectService);
const getAllProjectsController = new GetAllProjectsController(userProjectAccessService);

const projectRouter = express.Router();

projectRouter.get(
  "/all",
  JoiValidator.querySchemaValidationMiddleware(getAllProjectsQuerySchema),
  getAllProjectsController.handle.bind(getAllProjectsController)
);
projectRouter.post(
  "/create",
  AdminValidationMiddleware.middleware,
  JoiValidator.bodySchemaValidationMiddleware(createProjectBodySchema),
  createProjectController.handle.bind(createProjectController)
);

export default projectRouter;
