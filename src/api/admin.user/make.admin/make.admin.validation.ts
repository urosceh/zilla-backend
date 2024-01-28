import Joi from "joi";

export const makeAdminParamsSchema = Joi.object({
  userId: Joi.string().uuid().required(),
});
