import Joi from "joi";

export const giveAccessBodySchema = Joi.object({
  userId: Joi.string().uuid().required(),
  projectId: Joi.string().uuid().required(),
});
