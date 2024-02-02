import Joi from "joi";

export const setForgottenPasswordBodySchema = Joi.object({
  securityCode: Joi.string().required(),
  newPassword: Joi.string().min(8).required(),
});
