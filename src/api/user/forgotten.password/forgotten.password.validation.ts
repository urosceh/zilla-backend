import Joi from "joi";

export const forgottenPasswordBodySchema = Joi.object({
  email: Joi.string().email().required(),
});
