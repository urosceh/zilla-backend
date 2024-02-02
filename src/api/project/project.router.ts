import express from "express";
import {projectService, userProjectAccessService} from "../../domain/services.index";
import {JoiValidator} from "../../lib/joi/joi.validator";
import {AccessValidationMiddleware} from "../web.api.middleware/access.validation.middleware";
import {AdminValidationMiddleware} from "../web.api.middleware/admin.validation.middleware";
import {CreateProjectController} from "./create.project/create.project.controller";
import {createProjectBodySchema} from "./create.project/create.project.validation";
import {GetAllProjectsController} from "./get.all.projects/get.all.projects.controller";
import {getAllProjectsQuerySchema} from "./get.all.projects/get.all.projects.validation";
import {GetProjectController} from "./get.project/get.project.controller";
import {getProjectQuerySchema} from "./get.project/get.project.validation";

const getProjectController = new GetProjectController(projectService);
const getAllProjectsController = new GetAllProjectsController(userProjectAccessService);
const createProjectController = new CreateProjectController(projectService);

const projectRouter = express.Router();

projectRouter.get(
  "/",
  AccessValidationMiddleware.middleware,
  JoiValidator.querySchemaValidationMiddleware(getProjectQuerySchema),
  getProjectController.handle.bind(getProjectController)
);

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
