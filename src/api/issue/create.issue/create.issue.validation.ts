import Joi from "joi";
import {issueStatusSchema, projectKeySchema} from "../../abstract/validations";

export const createIssueBodySchema = Joi.object({
  projectKey: projectKeySchema.required(),
  issueStatus: issueStatusSchema.required(),
  summary: Joi.string().required(),
  assigneeId: Joi.string().uuid().allow(null).optional(),
  details: Joi.string().allow(null).optional(),
  sprintId: Joi.number().allow(null).optional(),
});
