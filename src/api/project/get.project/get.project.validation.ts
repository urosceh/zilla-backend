import Joi from "joi";
import {projectKeySchema} from "../../abstract/validations";

export const getProjectParamsSchema = Joi.object({
  projectKey: projectKeySchema.required(),
});
