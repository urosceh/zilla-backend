import Joi from "joi";
import {projectKeySchema} from "../../abstract/validations";

export const createSprintBodySchema = Joi.object({
  projectKey: projectKeySchema.required(),
  sprintName: Joi.string().required(),
  startOfSprint: Joi.date().required(),
  endOfSprint: Joi.date().required(),
});
