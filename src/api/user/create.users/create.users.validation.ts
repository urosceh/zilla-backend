import Joi from "joi";

export const createUsersBodySchema = Joi.object({
  emails: Joi.array().items(Joi.string().email().required()).required(),
});
