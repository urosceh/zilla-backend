import Joi from "joi";
import {projectKeySchema} from "../../abstract/validations";

export const ManageAccessBodySchema = Joi.object({
  userIds: Joi.array().items(Joi.string().uuid()).required(),
  projectKey: projectKeySchema,
});
