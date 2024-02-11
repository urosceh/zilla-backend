import Joi from "joi";
import {issueStatusSchema} from "../../abstract/validations";

export const updateIssueBodySchema = Joi.object({
  issueStatus: issueStatusSchema.optional(),
  summary: Joi.string().optional(),
  assigneeId: Joi.string().uuid().allow(null).optional(),
  details: Joi.string().allow(null).optional(),
  sprintId: Joi.number().allow(null).optional(),
});

export const updateIssueParamsSchema = Joi.object({
  issueId: Joi.string().uuid().required(),
});
