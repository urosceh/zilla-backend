import Joi from "joi";

export const changePasswordBodySchema = Joi.object({
  newPassword: Joi.string().min(8).required(),
  oldPassword: Joi.string().min(8).required(),
});
