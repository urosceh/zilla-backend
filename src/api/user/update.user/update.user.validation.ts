import Joi from "joi";

export const updateUserBodySchema = Joi.object({
  firstName: Joi.string().optional(),
  lastName: Joi.string().optional(),
});
