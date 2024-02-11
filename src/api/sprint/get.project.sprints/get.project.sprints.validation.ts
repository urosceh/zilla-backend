import Joi from "joi";
import {projectKeySchema} from "../../abstract/validations";

export const getProjectSprintsParamsSchema = Joi.object({
  projectKey: projectKeySchema.required(),
});
