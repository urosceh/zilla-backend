import Joi from "joi";

export const createProjectBodySchema = Joi.object({
  // only alphanumeric characters, dashes and underscores, maximum 20 characters
  projectName: Joi.string().required(),
  projectKey: Joi.string()
    .regex(/^[A-Z0-9-_]+$/)
    .max(20)
    .required(),
  managerId: Joi.string().uuid().required(),
});
