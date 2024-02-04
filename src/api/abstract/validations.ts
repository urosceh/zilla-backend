import Joi from "joi";
import {IssueStatus} from "../../domain/enums/IssueStatus";

export const projectKeySchema = Joi.string()
  .regex(/^[A-Z0-9-_]+$/)
  .max(20);

export const issueStatusSchema = Joi.string().allow(...Object.values(IssueStatus));

export const getIssuesParamsSchema = Joi.object({
  projectKey: projectKeySchema.required(),
  projectId: Joi.string().uuid().required(),
});

export const getIssuesQuerySchema = Joi.object({
  issueStatuses: Joi.array().items(issueStatusSchema).optional(),
  limit: Joi.number().integer().min(1).max(100).default(10),
  offset: Joi.number().integer().min(0).default(0),
  search: Joi.string().optional(),
});
