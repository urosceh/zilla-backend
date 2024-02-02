import Joi from "joi";
import {projectKeySchema} from "../../abstract/validations";

export const getProjectQuerySchema = Joi.object({
  projectKey: projectKeySchema.required(),
});
