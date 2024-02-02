import Joi from "joi";

export const forgottenPasswordBodySchema = Joi.object({
  email: Joi.string().email().required(),
  newPassword: Joi.string().min(8).optional(),
});
