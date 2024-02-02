import Joi from "joi";

export const updateUserBodySchema = Joi.object({
  password: Joi.string().min(8).optional(),
  oldPassword: Joi.string().min(8).when("password", {
    is: Joi.exist(),
    then: Joi.required(),
  }),
  firstName: Joi.string().optional(),
  lastName: Joi.string().optional(),
});
