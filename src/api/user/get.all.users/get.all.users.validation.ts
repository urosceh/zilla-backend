import Joi from "joi";
import {projectKeySchema} from "../../abstract/validations";

export const getAllUsersQuerySchema = Joi.object({
  projectKey: projectKeySchema.optional(),
  limit: Joi.number().integer().min(1).max(100).optional().default(10),
  offset: Joi.number().integer().min(0).optional().default(0),
});
