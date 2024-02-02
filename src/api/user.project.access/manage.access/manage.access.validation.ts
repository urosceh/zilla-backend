import Joi from "joi";

export const ManageAccessBodySchema = Joi.object({
  userIds: Joi.array().items(Joi.string().uuid()).required(),
});
