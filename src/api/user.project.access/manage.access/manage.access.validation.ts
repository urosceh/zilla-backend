import Joi from "joi";
import {projectKeySchema} from "../../abstract/validations";

export const manageAccessBodySchema = Joi.object({
  userIds: Joi.array().items(Joi.string().uuid()).required(),
  projectKey: projectKeySchema.required(),
});
