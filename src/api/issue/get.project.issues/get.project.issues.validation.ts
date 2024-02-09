import Joi from "joi";
import {getIssuesQuerySchema} from "../../abstract/validations";

export const getProjectIssuesQuerySchema = getIssuesQuerySchema.keys({
  assigneeIds: Joi.array().items(Joi.string().uuid()).optional(),
  reporterIds: Joi.array().items(Joi.string().uuid()).optional(),
  sprintIds: Joi.array().items(Joi.number().integer().min(1)).optional(),
  orderCol: Joi.string().valid("createdAt", "updatedAt").optional().default("updatedAt"),
  orderDir: Joi.string().valid("ASC", "DESC").optional().default("ASC"),
});
