import Joi from "joi";

export const getAllProjectsQuerySchema = Joi.object({
  limit: Joi.number().integer().min(1).max(100).default(10),
  offset: Joi.number().integer().min(0).default(0),
  search: Joi.string().optional(),
});
