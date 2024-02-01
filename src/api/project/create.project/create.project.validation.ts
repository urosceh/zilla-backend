import Joi from "joi";
import {projectKeySchema} from "../../abstract/validations";

export const createProjectBodySchema = Joi.object({
  // only alphanumeric characters, dashes and underscores, maximum 20 characters
  projectName: Joi.string().required(),
  projectKey: projectKeySchema,
  managerId: Joi.string().uuid().required(),
});
