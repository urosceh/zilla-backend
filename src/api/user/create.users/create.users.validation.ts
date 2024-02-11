import Joi from "joi";

export const createUsersBodySchema = Joi.object({
  users: Joi.array()
    .items(
      Joi.object({
        email: Joi.string().email().required(),
        firstName: Joi.string().required(),
        lastName: Joi.string().required(),
      })
    )
    .required(),
});
