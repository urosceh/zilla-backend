import Joi from "joi";

export const projectKeySchema = Joi.string()
  .regex(/^[A-Z0-9-_]+$/)
  .max(20)
  .required();
