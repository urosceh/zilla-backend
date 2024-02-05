import Joi from "joi";
import {issueStatusSchema, projectKeySchema} from "../../abstract/validations";

export const createIssueBodySchema = Joi.object({
  projectKey: projectKeySchema.required(),
  issueStatus: issueStatusSchema.required(),
  summary: Joi.string().required(),
  assigneeId: Joi.string().uuid().optional(),
  details: Joi.string().optional(),
  sprintId: Joi.number().optional(),
});
